import { networkInterfaces } from "node:os";

/**
 * The dev server rejects requests for /_next/* assets whose origin is not the
 * hostname it was started with, so opening the page on a phone over the LAN
 * serves the prerendered HTML but 403s every JS chunk — the page renders and
 * nothing is clickable. Allowlisting the machine's own LAN addresses keeps
 * on-device testing working across DHCP lease changes.
 */
function lanOrigins() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((net) => net && net.family === "IPv4" && !net.internal)
    .map((net) => net.address);
}

const extraDevOrigins = (process.env.NEXT_DEV_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  allowedDevOrigins: [...lanOrigins(), ...extraDevOrigins],
};

export default nextConfig;
