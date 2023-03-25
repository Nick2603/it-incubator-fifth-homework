import express, { Request, Response } from "express";
import cors from "cors";
import { blogsRouter } from "./routes/blogsRouter";
import { postsRouter } from "./routes/postsRouter";
import { blogsRepository } from "./repositories/blogsRepository";
import { postsRepository } from "./repositories/postsRepository";
import { CodeResponsesEnum } from "./types/CodeResponsesEnum";
import { usersRouter } from "./routes/usersRouter";
import { usersRepository } from "./repositories/usersRepository";
import { authRouter } from "./routes/authRouter";
import { commentsRouter } from "./routes/commentsRouter";
import { commentsRepository } from "./repositories/commentsRepository";

export const app = express();

const parserMiddleware = express.json();

app.use(cors());

app.use(parserMiddleware);

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsRepository.deleteAllBlogs();
  await postsRepository.deleteAllPosts();
  await usersRepository.deleteAllUsers();
  await commentsRepository.deleteAllComments();
  res.sendStatus(CodeResponsesEnum.No_content_204);
});

app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/comments", commentsRouter);
