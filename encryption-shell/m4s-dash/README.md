// 创建
ffmpeg -i input.mp4 -c copy -f dash output.mpd
// 合成
ffmpeg -i output.mpd -c copy input.mp4