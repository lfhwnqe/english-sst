"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { MMCERC721Coin__factory } from "@/abi/typechain-types";
import { Box, Card, CardContent, Grid } from "@mui/material";
import { mmcNFTAddressAtom } from "@/app/stores/web3";
import { useAtomValue } from "jotai";
import { Award } from "lucide-react";
import ThemeText from "@/app/components/common/ThemeText";
import { useTranslations } from "next-intl";
import Web3Loading from "../common/Web3Loading";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export default function NFTList() {
  const mmcNFTAddress = useAtomValue(mmcNFTAddressAtom);

  const { address } = useAccount();
  const [nftMetadata, setNFTMetadata] = useState<{
    [key: string]: NFTMetadata;
  }>({});
  const t = useTranslations("NFTComponent");

  // 读取用户的 NFT
  const { data: nftData, isLoading } = useReadContract({
    address: mmcNFTAddress as `0x${string}`,
    abi: MMCERC721Coin__factory.abi,
    functionName: "getUserNFTsByPage",
    args: [address as `0x${string}`, BigInt(0), BigInt(10)],
  });

  useEffect(() => {
    const fetchAllMetadata = async () => {
      if (!nftData || !nftData[1]) return;

      const metadata: { [key: string]: NFTMetadata } = {};
      await Promise.all(
        nftData[1].map(async (tokenURI: string, index: number) => {
          try {
            const response = await fetch(tokenURI);
            const data: NFTMetadata = await response.json();
            metadata[index] = data;
          } catch (error) {
            console.error(`获取 NFT ${index} 元数据失败:`, error);
          }
        })
      );
      setNFTMetadata(metadata);
    };

    if (nftData && nftData[1]?.length > 0) {
      fetchAllMetadata();
    }
  }, [nftData]);

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-[400px]">
        <Web3Loading />
      </Box>
    );
  }

  if (!nftData || !nftData[1] || nftData[1].length === 0) {
    return (
      <Box className="text-center py-12">
        <ThemeText variant="h6" className="mb-2 text-white">
          {t("nft.noNFT")}
        </ThemeText>
        <ThemeText className="text-gray-400">{t("nft.getNFT")}</ThemeText>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {nftData[1].map((tokenURI: string, index: number) => {
        const metadata = nftMetadata[index];
        if (!metadata) return null;

        return (
          <Grid item xs={12} sm={6} md={4} key={nftData[0][index].toString()}>
            <Card
              className="h-full transition-all duration-300 relative 
              before:absolute before:inset-0 before:p-[2px] before:rounded-lg before:-z-10
              before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500
              bg-white/5 backdrop-blur-sm
              shadow-[0_0_15px_rgba(59,130,246,0.3)]
              hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]
              scale-[1.02] hover:scale-[1.03]
              ring-1 ring-white/10 hover:ring-blue-500/30"
            >
              <Box
                sx={{
                  width: "100%",
                  height: "240px",
                  overflow: "hidden",
                  position: "relative",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                <img
                  src={metadata.image}
                  alt={metadata.name}
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                <div className="absolute top-3 right-3">
                  <Award className="w-6 h-6 text-blue-500" strokeWidth={2.5} />
                </div>
              </Box>
              <CardContent className="p-3">
                <ThemeText
                  variant="h6"
                  className="text-base font-bold mb-1 line-clamp-1 text-white"
                >
                  {metadata.name}
                </ThemeText>
                <ThemeText
                  variant="body1"
                  className="mb-2 line-clamp-2 text-gray-300"
                >
                  {metadata.description}
                </ThemeText>
                <div className="grid grid-cols-2 gap-2">
                  {metadata.attributes?.map((attr, i) => (
                    <div key={i} className="text-sm">
                      <ThemeText className="text-gray-400">
                        {attr.trait_type}
                      </ThemeText>
                      <ThemeText className="font-medium text-white">
                        {attr.value}
                      </ThemeText>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
