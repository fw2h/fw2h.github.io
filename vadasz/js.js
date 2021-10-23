const images = ["d1.jpg","d2.jpg","c1.jpg","c2.jpg"]
let shuff_images = []
let length = images.length

let image_counter = 0

let next_btn = document.querySelector("#next_btn")
let start_btn = document.querySelector("#start_btn")

let game_img = document.querySelector("#game_img")
let img_counter = document.querySelector("#img_counter")

let menu_div = document.querySelector("#menu_div")
let game_div = document.querySelector("#game_div")

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

function next_pics(e) {
    let last_image = shuff_images.pop()

    if (!(last_image)) {
        menu_div.hidden = false
        game_div.hidden = true
        image_counter = 0
        return
    }
    image_counter++
    img_counter.innerHTML = `${image_counter}/${length}`
    game_img.src = `img/${last_image}`
}

function start_game(e) {
    shuff_images = [...images]
    shuffle(shuff_images)

    let last_image = shuff_images.pop()
    game_img.src = `img/${last_image}`

    image_counter++
    img_counter.innerHTML = `${image_counter}/${length}`

    menu_div.hidden = true
    game_div.hidden = false
}


next_btn.addEventListener("click", next_pics)
start_btn.addEventListener("click", start_game)