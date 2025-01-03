import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

export const authState = atom({
  key: "user",
  default: JSON.parse(localStorage.getItem("user") || "{}") || {
    isAuthenticated: false,
    user: null,
    token: null,
  },
});

export const authStatePersist = selector({
  key: "authStatePersist",
  get: ({ get }) => get(authState),
  set: ({ set }, newValue) => {
    set(authState, newValue);
    localStorage.setItem("user", JSON.stringify(newValue));
  },
});

export const sheetState = atom({
  key: "sheet",
  default: {
    sheetName: "",
  },
});
