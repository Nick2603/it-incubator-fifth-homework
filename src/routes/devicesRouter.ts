import { Request, Response, Router } from "express";
import { jwtService } from "../application/jwtService";
import { sessionsService } from "../domains/sessionsService";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";

export const devicesRouter = Router({});

devicesRouter.get('/', async (req: Request, res: Response) => {
  const refreshTokenFromReq = req.cookies["refreshToken"];
  if (!refreshTokenFromReq) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  };

  const userId = await jwtService.getUserIdByToken(refreshTokenFromReq);
  if (!userId) {
    return res.status(401).send('Access Denied. Incorrect refresh token provided.');
  };

  const sessions = await sessionsService.getSessionsByUserId(userId);

  res.status(200).send(sessions);
});

devicesRouter.delete('/', async (req: Request, res: Response) => {
  const refreshTokenFromReq = req.cookies["refreshToken"];
  if (!refreshTokenFromReq) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  };

  const userId = await jwtService.getUserIdByToken(refreshTokenFromReq);
  if (!userId) {
    return res.status(401).send('Access Denied. Incorrect refresh token provided.');
  };

  const result = await sessionsService.deleteAllSessionsExceptCurrent(refreshTokenFromReq, userId);
  if (result) {
    res.sendStatus(CodeResponsesEnum.No_content_204);
    return;
  };
  res.sendStatus(CodeResponsesEnum.Not_found_404);
});

devicesRouter.delete('/:deviceId', async (req: Request, res: Response) => {
  const deviceId = req.params.deviceId;
  const refreshTokenFromReq = req.cookies["refreshToken"];
  if (!refreshTokenFromReq) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  };

  const userId = await jwtService.getUserIdByToken(refreshTokenFromReq);
  if (!userId) {
    return res.status(401).send('Access Denied. Incorrect refresh token provided.');
  };

  const result = await sessionsService.deleteSessionByDeviceId(deviceId, userId);
  if (result === true) {
    res.sendStatus(CodeResponsesEnum.No_content_204);
    return;
  };

  if (result === "Forbidden") {
    res.sendStatus(CodeResponsesEnum.Forbidden_403);
    return;
  };

  res.sendStatus(CodeResponsesEnum.Not_found_404);
});
