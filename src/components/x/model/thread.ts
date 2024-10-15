// File: interfaces/thread.interface.ts

import { Types } from "mongoose";
import { ICommunity } from "./community";
import { IUser } from "./user";

export interface IThread {
  _id: Types.ObjectId; // or string if you prefer
  text: string;
  author: IUser;
  community?: ICommunity;
  createdAt: Date;
  parentId?: string;
  children: IThread[];
}
