import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { commentsService } from "../domains/commentsService";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { bearerAuthMiddleware } from "../middlewares/bearerAuthMiddleware";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";

export const commentsRouter = Router({});

export const contentValidationMiddleware = body("content").isString().trim().isLength({ min: 20, max: 300 }).withMessage("Incorrect value for content");

commentsRouter.get('/:commentId', async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const comment = await commentsService.getCommentById(commentId);
  if (comment) {
    res.status(200).send(comment);
    return;
  };
  res.sendStatus(CodeResponsesEnum.Not_found_404);
});

commentsRouter.put('/:commentId',
  bearerAuthMiddleware,
  contentValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const commentId = req.params.commentId;
    const content = req.body.content;
    const userId = req.user!.id;

    const result = await commentsService.updateComment(commentId, content, userId);
    if (result === "Not found") return res.sendStatus(CodeResponsesEnum.Not_found_404);
    if (result === "Forbidden") return res.sendStatus(CodeResponsesEnum.Forbidden_403);
    if (result === "Updated") return res.sendStatus(CodeResponsesEnum.No_content_204);
  }
);

commentsRouter.delete('/:commentId', bearerAuthMiddleware, async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const userId = req.user!.id;
  const result = await commentsService.deleteComment(commentId, userId.toString());
  if (result === "Not found") return res.sendStatus(CodeResponsesEnum.Not_found_404);
  if (result === "Forbidden") return res.sendStatus(CodeResponsesEnum.Forbidden_403);
  if (result === "Updated") return res.sendStatus(CodeResponsesEnum.No_content_204);
});
