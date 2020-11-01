export type Color = 'red' | 'blue' | 'green' | 'pink' | 'orange' | 'yellow' | 'black' | 'white' | 'purple' | 'brown' | 'cyan' | 'lime'

export type Region = 'NA' | 'EU' | 'ASIA' | string

export interface GameInfo {
  code: string;
  region: Region;
}

export const regionNames = {
    na: 'North America',
    eu: 'Europe',
    asia: 'Asia'
}