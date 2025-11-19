export interface NotificationPayload {
    id?: string;
    type: string;
    title: string;
    message?: string;
}
export interface MusicTrackEventDetail {
    id: string;
    title: string;
}
export declare function emit<K extends string>(name: K, detail?: any): void;
export declare function on<K extends string>(name: K, handler: (detail: any) => void): () => void;
export declare const emitNotification: (d: NotificationPayload) => void;
export declare const onNotification: (h: (d: NotificationPayload) => void) => () => void;
export declare const emitGameStateCorrupt: (d: {
    reason: string;
}) => void;
export declare const emitMusicTrackChange: (d: MusicTrackEventDetail) => void;
export declare const onMusicTrackChange: (h: (d: MusicTrackEventDetail) => void) => () => void;
export declare const emitMusicPlay: (d: MusicTrackEventDetail) => void;
export declare const onMusicPlay: (h: (d: MusicTrackEventDetail) => void) => () => void;
export declare const emitMusicPause: (d: MusicTrackEventDetail) => void;
export declare const onMusicPause: (h: (d: MusicTrackEventDetail) => void) => () => void;
