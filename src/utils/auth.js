import Store from "@/store"


export const getTokenAUTH = () => Store.state.user.profile.token

function getActualWidthOfChars(text, options = {}) {
    const {
        size = 14, family = "Microsoft YaHei"
    } = options;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${size}px ${family}`;
    const metrics = ctx.measureText(text);
    return Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
}

export default getActualWidthOfChars