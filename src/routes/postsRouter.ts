import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { basicAuthMiddleware } from "../middlewares/basicAuthMiddleware";
import { isValidBlogId } from "../middlewares/blogIdValidationMiddleware";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { postsService } from "../domains/postsService";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";
import { postsQueryRepository } from "../repositories/postsQueryRepository";
import { bearerAuthMiddleware } from "../middlewares/bearerAuthMiddleware";
import { contentValidationMiddleware } from "./commentsRouter";
import { commentsService } from "../domains/commentsService";
import { commentsQueryRepository } from "../repositories/commentsQueryRepository";

export const postsRouter = Router({});

export const titleValidationMiddleware = body("title").isString().trim().isLength({ min: 2, max: 30 }).withMessage("Incorrect value for title");

export const shortDescriptionValidationMiddleware = body("shortDescription").isString().trim().isLength({ min: 2, max: 100 }).withMessage("Incorrect value for shortDescription");

export const contentDescriptionValidationMiddleware = body("content").isString().trim().isLength({ min: 2, max: 1000 }).withMessage("Incorrect value for content");

const blogIdValidationMiddleware = body("blogId").custom(isValidBlogId);

postsRouter.get('/', async (req: Request, res: Response) => {
  const title = req.query.title;
  const sortBy = req.query.sortBy;
  const sortDirection = req.query.sortDirection;
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;
  const posts = await postsQueryRepository.getPosts({title, sortBy, sortDirection, pageNumber, pageSize});
  res.status(200).send(posts);
});

postsRouter.get('/:id', async (req: Request, res: Response) => {
  const postId = req.params.id;
  const post = await postsService.getPostById(postId);
  if (post) {
    res.status(200).send(post);
    return;
  };
  res.sendStatus(CodeResponsesEnum.Not_found_404);
});

postsRouter.post('/',
  basicAuthMiddleware,
  titleValidationMiddleware,
  shortDescriptionValidationMiddleware,
  contentDescriptionValidationMiddleware,
  blogIdValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;

    const newPost = await postsService.createPost(title, shortDescription, content, blogId);
    res.status(CodeResponsesEnum.Created_201).send(newPost);
  }
);

postsRouter.put('/:id',
  basicAuthMiddleware,
  titleValidationMiddleware,
  shortDescriptionValidationMiddleware,
  contentDescriptionValidationMiddleware,
  blogIdValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;

    const result = await postsService.updatePost(postId, title, shortDescription, content, blogId);
    if (result) {
      res.sendStatus(CodeResponsesEnum.No_content_204);
    } else {
      res.sendStatus(CodeResponsesEnum.Not_found_404);
    };
  }
);

postsRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await postsService.deletePost(id);
  if (result) {
    res.sendStatus(CodeResponsesEnum.No_content_204);
    return;
  }
  res.sendStatus(CodeResponsesEnum.Not_found_404);
});

postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const post = await postsService.getPostById(postId);
  if (!post) {
    res.sendStatus(CodeResponsesEnum.Not_found_404);
    return;
  };

  const sortBy = req.query.sortBy;
  const sortDirection = req.query.sortDirection;
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;
  const comments = await commentsQueryRepository.getComments(sortBy, sortDirection, pageNumber, pageSize, postId);
  res.status(200).send(comments);
});

postsRouter.post('/:postId/comments',
  bearerAuthMiddleware,
  contentValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const post = await postsService.getPostById(postId);
    if (!post) {
      res.sendStatus(CodeResponsesEnum.Not_found_404);
      return;
    };

    const userId = req.user!.id;
    const content = req.body.content;

    const newComment = await commentsService.createComment(content, postId, userId);
    res.status(CodeResponsesEnum.Created_201).send(newComment);
  }
);
