import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { authMiddleware } from "../middlewares/authMiddleware";
import { inputValidationMiddleware } from "../middlewares/inputValidationMiddleware";
import { blogsService } from "../domains/blogsService";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";
import { blogsQueryRepository } from "../repositories/blogsQueryRepository";
import { postsQueryRepository } from "../repositories/postsQueryRepository";
import { contentDescriptionValidationMiddleware, shortDescriptionValidationMiddleware, titleValidationMiddleware } from "./postsRouter";
import { postsService } from "../domains/postsService";

export const blogsRouter = Router({});

const nameValidationMiddleware = body("name").isString().trim().isLength({ min: 2, max: 15 }).withMessage("Incorrect value for name");

const descriptionValidationMiddleware = body("description").isString().trim().isLength({ min: 2, max: 500 }).withMessage("Incorrect value for description");

const websiteUrlValidationMiddleware = body("websiteUrl").isString().trim().isLength({ min: 2, max: 100 }).matches("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$").withMessage("Incorrect value for websiteUrl");

blogsRouter.get('/', async (req: Request, res: Response) => {
  const searchNameTerm = req.query.searchNameTerm;
  const sortBy = req.query.sortBy;
  const sortDirection = req.query.sortDirection;
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;
  const blogs = await blogsQueryRepository.getBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize});
  res.status(200).send(blogs);
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const blog = await blogsService.getBlogById(blogId);
  if (blog) {
    res.status(200).send(blog);
    return;
  };
  res.sendStatus(CodeResponsesEnum.Not_found_404);
});

blogsRouter.post('/',
  authMiddleware,
  nameValidationMiddleware,
  descriptionValidationMiddleware,
  websiteUrlValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;

    const newBlog = await blogsService.createBlog(name, description, websiteUrl);
    res.status(CodeResponsesEnum.Created_201).send(newBlog);
  }
);

blogsRouter.put('/:id',
  authMiddleware,
  nameValidationMiddleware,
  descriptionValidationMiddleware,
  websiteUrlValidationMiddleware,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;

    const result = await blogsService.updateBlog(blogId, name, description, websiteUrl);
    if (result) {
      res.sendStatus(CodeResponsesEnum.No_content_204);
    } else {
      res.sendStatus(CodeResponsesEnum.Not_found_404);
    };
  }
);

blogsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await blogsService.deleteBlog(id);
  if (result) {
    res.sendStatus(CodeResponsesEnum.No_content_204);
    return;
  }
  res.sendStatus(CodeResponsesEnum.Not_found_404);
});

blogsRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
  const blogId = req.params.blogId;
  const blog = await blogsService.getBlogById(blogId);
  if (blog) {
    const title = req.params.title;
    const sortBy = req.query.sortBy;
    const sortDirection = req.query.sortDirection;
    const pageNumber = req.query.pageNumber;
    const pageSize = req.query.pageSize;
    const posts = await postsQueryRepository.getPosts({title, sortBy, sortDirection, pageNumber, pageSize, blogId});
    res.status(200).send(posts);
    return;
  }
  res.sendStatus(CodeResponsesEnum.Not_found_404);
});

blogsRouter.post('/:blogId/posts',
authMiddleware,
titleValidationMiddleware,
shortDescriptionValidationMiddleware,
contentDescriptionValidationMiddleware,
inputValidationMiddleware,
async (req: Request, res: Response) => {
  const blogId = req.params.blogId;
  const blog = await blogsService.getBlogById(blogId);
  if (blog) {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;

    const newPost = await postsService.createPost(title, shortDescription, content, blogId);
    res.status(CodeResponsesEnum.Created_201).send(newPost);
    return;
  }
  res.sendStatus(CodeResponsesEnum.Not_found_404);
});
