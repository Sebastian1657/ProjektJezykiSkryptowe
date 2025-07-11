export type Event = {
  _id: string;
  createdBy: {
    _id: string;
    name?: string;
    surname?: string;
  };
  description?: string;
  sharedWith: ({
    _id: string;
    name?: string;
    surname?: string;
  } | string)[];
  startDate: string;
  endDate?: string;
  title?: string;
  emoji?: string;
};
export type EventFormData = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  sharedWith: ({
    _id: string;
    name?: string;
    surname?: string;
  } | string)[];
  emoji: string;
};