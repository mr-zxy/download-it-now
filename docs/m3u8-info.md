#EXTM3U                    M3U8文件头，必须放在第一行;
#EXT-X-MEDIA-SEQUENCE      第一个TS分片的序列号，一般情况下是0，但是在直播场景下，这个序列号标识直播段的起始位置; #EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION      每个分片TS的最大的时长;   
#EXT-X-TARGETDURATION:10     每个分片的最大时长是 10s
#EXT-X-ALLOW-CACHE         是否允许cache;          
#EXT-X-ALLOW-CACHE:YES      
#EXT-X-ALLOW-CACHE:NO    默认情况下是YES
#EXT-X-ENDLIST             M3U8文件结束符；
#EXTINF                    extra info，分片TS的信息，如时长，带宽等；一般情况下是    
#EXTINF:<duration>,[<title>] 后面可以跟着其他的信息，逗号之前是当前分片的ts时长，分片时长 移动要小于 
#EXT-X-TARGETDURATION 定义的值；
#EXT-X-VERSION             M3U8版本号
#EXT-X-DISCONTINUITY       该标签表明其前一个切片与下一个切片之间存在中断。下面会详解
#EXT-X-PLAYLIST-TYPE       表明流媒体类型；
#EXT-X-KEY                 是否加密解析，    
#EXT-X-KEY:METHOD=AES-128,URI="http://localhost:8080/ld/encrypt.key"    加密方式是AES-128,秘钥需要请求http://localhost:8080/ld/encrypt.key，请求回来存储在本地；