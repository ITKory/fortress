// lib/yandex-direct.ts
export const getYandexDirectUrl = async (publicKey: string, path: string): Promise<string> => {
    const res = await fetch(
        `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}&path=${encodeURIComponent(path)}`
    );

    if (!res.ok) throw new Error("Failed to get download link");

    const json = await res.json();
    return json.href;
};
