const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const playList = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progress = $('.progress')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Du du du du',
            singer: 'Blackpink',
            path: './assets/song/dudududu.mp3',
            image: 'https://thegioidienanh.vn/stores/news_dataimages/anhvu/072019/30/09/1944_02.jpg',
        },
        {
            name: 'Kill this love',
            singer: 'Blackpink',
            path: './assets/song/killthislove.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/e/ee/KillThisLove.jpeg',
        },
        {
            name: 'How you like that',
            singer: 'Blackpink',
            path: './assets/song/howyoulikethat.mp3',
            image: 'https://image.thanhnien.vn/w1024/Uploaded/2022/mtfqu/2021_11_12/blackpink-7206.jpeg',
        },
        {
            name: 'Lovesick girls',
            singer: 'Blackpink',
            path: './assets/song/lovesickgirl.mp3',
            image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2020/10/2/841234/Mv-Blackpink-2.jpg',
        },
        {
            name: 'Playing with fire',
            singer: 'Blackpink',
            path: './assets/song/playingwithfire.mp3',
            image: 'https://i.pinimg.com/originals/5b/ae/d2/5baed297e72995df5c1d6aa3f52d9860.jpg',
        },
        {
            name: 'Boombayah',
            singer: 'Blackpink',
            path: './assets/song/boombayah.mp3',
            image: 'https://file.tinnhac.com/resize/600x-/music/2017/08/14/black-pink-2-d840.jpg',
        },
        {
            name: 'Shape of you',
            singer: 'Ed Sheeran',
            path: './assets/song/shapeofyou.mp3',
            image: 'https://cdn.mottech.net/wp-content/uploads/2021/08/Shape-Of-You-La-Gi.jpg',
        },
        {
            name: 'See you again',
            singer: 'Wiz Khalifa',
            path: './assets/song/seeyouagain.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/8/8d/CharliePuthSeeYouAgain.png',
        },
        {
            name: 'Let her go',
            singer: 'Passenger',
            path: './assets/song/lethergo.mp3',
            image: 'https://i1.sndcdn.com/artworks-000121226136-2dbpbt-t500x500.jpg',
        },
        {
            name: 'Girls like you',
            singer: 'Maroon 5',
            path: './assets/song/girlslikeyou.mp3',
            image: 'http://theharmonica.vn/wp-content/uploads/2019/02/girlslikeyou.jpg',
        },
    ],

    // Hiển thị danh sách các bài hát
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },

    // Định nghĩa các thuộc tính cho object
    definePropeties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    // Xử lý các sự kiện  
    handleEvents: function() {
        const cdWidth = cd.offsetWidth

        // Xử lý quay và dừng đĩa 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })   
        cdThumbAnimate.pause()     

        // Xử lý scroll top
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play 
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Xử lý khi play bài hát
        audio.onplay = function() {
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Xử lý khi pause bài hát
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Xử lý khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Xử lý khi next bài hát
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lý khi prev bài hát
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lý nút random bài hát khi click vào randomBtn
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }

        // Xử lý next song khi audio kết thúc 
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lý nút repeat khi click vào repeatBtn
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        // Xử lý hành vi lắng nghe click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            // Xử lý khi click vào bài hát (playlist)
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
            }
        }
        
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest' 
            })
        }, 500)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    // Chạy ứng dụng
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.definePropeties()

        // Xử lý các sự kiện 
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên, in ra giao diện khi chạy ứng dụng
        this.loadCurrentSong()

        // Hiển thị danh sách các bài hát
        this.render()
    }
}

app.start()

console.log(12345)