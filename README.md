# vod-live-stream-ffmpeg-example

## idea
stream video directly from server and watch it with friends

example videos:
- https://storage.googleapis.com/skilful-alpha-317202/6FGT_93AF89O/22a1_1626223484.22.0_165056.mp4

pass this url to the server - server will start transcoding the mp4 video to hls. then you can watch that video from your broweser with given room id

videos will be stored in ./server/room/{roomId} directory

wait for the server to load the index.m3u8 file(check room directory) then press watch stream otherwise it wont work
you need ffmpeg installed on your pc


this is a very naive implementation just to show you how you can implement your own vod/streaming service 
