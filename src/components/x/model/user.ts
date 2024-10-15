// File: interfaces/user.interface.ts

import { Types } from "mongoose";
import { ICommunity } from "./community";
import { IThread } from "./thread";

export interface IUser {
  _id: Types.ObjectId;
  id?: string;
  username: string;
  name: string;
  image?: string;
  bio?: string;
  threads: Types.ObjectId[] | IThread[];
  communities: Types.ObjectId[] | ICommunity[];
  onboarded: boolean;
}
