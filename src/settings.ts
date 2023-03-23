import express, { Request, Response } from "express";
import cors from "cors";
import { blogsRouter } from "./routes/blogsRouter";
import { postsRouter } from "./routes/postsRouter";
import { blogsRepository } from "./repositories/blogsRepository";
import { postsRepository } from "./repositories/postsRepository";
import { CodeResponsesEnum } from "./types/CodeResponsesEnum";

export const app = express();

const parserMiddleware = express.json();

app.use(cors());

app.use(parserMiddleware);

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsRepository.deleteAllBlogs();
  await postsRepository.deleteAllPosts();
  res.sendStatus(CodeResponsesEnum.No_content_204);
});

app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
