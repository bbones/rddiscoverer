class Decode {
  decode (str) {
    return str.split('/')
  }
  run () {
    console.log(this.decode('test/t1/t2/t3'))
  }
}

let decode = new Decode()
let f = decode.run

f()
