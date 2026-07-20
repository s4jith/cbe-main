import type { Access } from "payload";

export const isAdmin: Access = ({ req }) => req.user?.role === "admin";

export const isLoggedIn: Access = ({ req }) => Boolean(req.user);

export const anyone: Access = () => true;
