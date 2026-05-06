export interface ShopItem {
  id: string;
  label: string;
  targetItemId: string;
  price: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "shop_global_bomb", label: "전체공격", targetItemId: "global_bomb", price: 5 },
  { id: "shop_bomb", label: "일부공격", targetItemId: "bomb", price: 2 },
  { id: "shop_freeze", label: "느리게", targetItemId: "freeze", price: 2 },
  { id: "shop_heart", label: "하트 증가", targetItemId: "heart_boost", price: 1 },
];

export const DEFAULT_ITEM_INVENTORY: Record<string, number> = {
  bomb: 0,
  freeze: 0,
  global_bomb: 0,
  heart_boost: 0,
};

export const MAX_ITEM_INVENTORY = 99;
export const SHOP_BUY_COOLDOWN_MS = 250;
