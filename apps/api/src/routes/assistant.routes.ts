import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, IConversationDocument } from '../models/Conversation.js';
import { Farm } from '../models/Farm.js';
import { MLService } from '../services/mlService.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { chatMessageInputSchema } from '@agrosmart/shared-validation';
import { AppError } from '../middleware/errorHandler.js';

export const assistantRouter = Router();

assistantRouter.use(authenticate);

// Chat with Agricultural Assistant
assistantRouter.post(
  '/chat',
  validateBody(chatMessageInputSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId, message, farmId } = req.body;
      let conversation: IConversationDocument | null = null;
      let farmContext: any = null;

      // Load farm context if selected
      if (farmId) {
        const farm = await Farm.findOne({ _id: farmId, userId: req.user!.id });
        if (farm) {
          farmContext = farm.toJSON();
        }
      }

      // Find or create conversation
      if (conversationId) {
        conversation = await Conversation.findOne({
          _id: conversationId,
          userId: req.user!.id,
        });
      }

      if (!conversation) {
        // Generate automatic title from first query
        const title = message.length > 40 ? `${message.slice(0, 37)}...` : message;
        conversation = new Conversation({
          userId: req.user!.id,
          title,
          farmId,
          messages: [],
        });
      }

      // Append user message
      const userMsg = {
        id: uuidv4(),
        role: 'user' as const,
        content: message,
        farmContextUsed: farmContext ? farmContext.name : undefined,
        timestamp: new Date(),
      };
      conversation.messages.push(userMsg);

      // Format previous history for LLM
      const historyPayload = conversation.messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Call ML Assistant service
      const assistantResult = await MLService.chatWithAssistant(
        message,
        historyPayload,
        farmContext
      );

      // Append assistant message
      const assistantMsg = {
        id: uuidv4(),
        role: 'assistant' as const,
        content: assistantResult.response,
        farmContextUsed: farmContext ? farmContext.name : undefined,
        timestamp: new Date(),
      };
      conversation.messages.push(assistantMsg);

      await conversation.save();

      res.json({
        success: true,
        data: {
          conversationId: conversation._id.toString(),
          title: conversation.title,
          message: assistantMsg,
          provider: assistantResult.provider,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// List Conversations
assistantRouter.get('/conversations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversations = await Conversation.find({ userId: req.user!.id })
      .select('title farmId createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: conversations.map((c) => c.toJSON()),
    });
  } catch (error) {
    next(error);
  }
});

// Get Specific Conversation with Messages
assistantRouter.get('/conversations/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!conversation) {
      throw new AppError('Conversation not found.', 404, 'CONVERSATION_NOT_FOUND');
    }

    res.json({
      success: true,
      data: conversation.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// Delete Conversation
assistantRouter.delete('/conversations/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!conversation) {
      throw new AppError('Conversation not found.', 404, 'CONVERSATION_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Conversation deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});
