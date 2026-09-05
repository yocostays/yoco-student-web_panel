import { ANDROID_PACKAGE_NAME } from "@/lib/app-links";

const RELEASE_SHA256_FINGERPRINTS = [
  "45:4D:1C:00:7F:A7:42:34:16:4A:65:84:73:61:22:CF:AC:E1:AC:05:E2:FC:04:94:74:D5:B0:AA:6A:7E:B5:07",
];

function extraFingerprints() {
  return (process.env.ANDROID_SHA256_FINGERPRINTS || "")
    .split(/[,;\n]+/)
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
}

export const ASSETLINKS_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
  "X-Content-Type-Options": "nosniff",
};

export function getAssetLinkStatements() {
  const sha256CertFingerprints = [
    ...new Set([...RELEASE_SHA256_FINGERPRINTS, ...extraFingerprints()]),
  ];

  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE_NAME,
        sha256_cert_fingerprints: sha256CertFingerprints,
      },
    },
  ];
}
