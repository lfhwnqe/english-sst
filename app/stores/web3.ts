import { atom } from "jotai";
import { courseMarketAddress, MMCTokenAddress } from "../config/contracts";

export const courseMarketAddressAtom = atom(courseMarketAddress);
export const mmcTokenAddressAtom = atom(MMCTokenAddress);
