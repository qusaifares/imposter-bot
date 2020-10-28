import { Color } from "libs/amongUs";

interface EmojiInfo {
    color: Color,
    id: string
}

export const emojisInfo: EmojiInfo[] = [
    { color: 'yellow', id: '770750870505521194' },
    { color: 'white', id: '770750870770024479' },
    { color: 'red', id: '770750870815899738' },
    { color: 'purple', id: '770750870521905183' },
    { color: 'pink', id: '770750870991405056' },
    { color: 'orange', id: '770750871012245504' },
    { color: 'lime', id: '770750870790340649' },
    { color: 'green', id: '770750869955280967' },
    { color: 'cyan', id: '770750869959606314' },
    { color: 'brown', id: '770750870006267944' },
    { color: 'blue', id: '770750869469265953' },
    { color: 'black', id: '770750869846097960' }
]

export const emojiString = ({color, id}: EmojiInfo) => `<:${color}:${id}>`