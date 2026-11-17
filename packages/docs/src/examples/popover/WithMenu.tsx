"use client";
import { useState } from "react";
import { Button, CaretDownIcon, Menu, MenuItem, Popover } from "@futurewiz-rms/mint";

const labels: Record<string, string> = { latest: "최신순", popular: "인기순", price: "가격순" };

// 목록을 띄우고 고르면 닫아요(open을 직접 들고 있는 제어 방식). matchWidth면 상자 폭이 버튼과 같아요
export default function WithMenu() {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("latest");
  return (
    <Popover
      trigger={(props) => (
        <Button variant="outline" color="neutral" rightAddon={<CaretDownIcon />} {...props}>
          {labels[sort]}
        </Button>
      )}
      open={open}
      matchWidth
      padding={0}
      aria-label="정렬"
      onOpenChange={setOpen}
    >
      <Menu
        value={sort}
        aria-label="정렬 기준"
        onChange={(next) => {
          setSort(next as string);
          setOpen(false);
        }}
        className="w-full shadow-none"
      >
        <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="popular">인기순</MenuItem>
        <MenuItem value="price">가격순</MenuItem>
      </Menu>
    </Popover>
  );
}
