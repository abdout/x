// File: interfaces/community.interface.ts

import { Types } from "mongoose";
import { IThread } from "./thread";
import { IUser } from "./user";

export interface ICommunity {
  _id: Types.ObjectId;
  id: string;
  username: string;
  name: string;
  image?: string;
  bio?: string;
  createdBy: IUser | Types.ObjectId;
  threads: Types.ObjectId[] | IThread[];
  members: Types.ObjectId[] | IUser[];
}
