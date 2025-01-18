"use client";

import { TextField } from "@mui/material";

interface TokenInputProps {
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  tokenSymbol: string;
  tokenIcon?: string;
}

export default function TokenInput({
  value,
  onChange,
  disabled,
  placeholder = "0",
  tokenSymbol,
  tokenIcon,
}: TokenInputProps) {
  return (
    <div className="relative">
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="bg-white/50 dark:bg-gray-900/50 rounded-lg"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(156, 163, 175, 0.2)',
            },
            '& input': {
              color: 'rgb(107, 114, 128)',
            },
            '&.Mui-focused input': {
              color: 'rgb(59, 130, 246)',
            }
          },
          '& .MuiOutlinedInput-root.Mui-disabled input': {
            '-webkit-text-fill-color': 'rgb(107, 114, 128)',
          },
          '@media (prefers-color-scheme: dark)': {
            '& .MuiOutlinedInput-root': {
              '& input': {
                color: 'rgb(156, 163, 175)',
              },
              '&.Mui-focused input': {
                color: 'rgb(96, 165, 250)',
              }
            },
            '& .MuiOutlinedInput-root.Mui-disabled input': {
              '-webkit-text-fill-color': 'rgb(156, 163, 175)',
            }
          }
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {tokenIcon && <img src={tokenIcon} alt={tokenSymbol} className="w-5 h-5" />}
        <span className="text-gray-500 dark:text-gray-400">{tokenSymbol}</span>
      </div>
    </div>
  );
} 