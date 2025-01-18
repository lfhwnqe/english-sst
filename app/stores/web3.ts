import { atom } from "jotai";
import { courseMarketAddress, mmcNFTAddress, MMCTokenAddress, mockOracleAddress } from "../config/contracts";

export const courseMarketAddressAtom = atom(courseMarketAddress);
export const mmcTokenAddressAtom = atom(MMCTokenAddress);
export const mmcNFTAddressAtom = atom(mmcNFTAddress);
export const mockOracleAddressAtom = atom(mockOracleAddress);
