export type ErrorsType = {
  errorsMessages: ErrorsMessagesType[];
};

type ErrorsMessagesType = {
  message: string;
  field: string;
};
