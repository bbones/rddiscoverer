class Decode {
  decode (str) {
    return str.split('/')
  }
  run () {
    console.log(this.decode('test/t1/t2/t3'))
  }
}

let dec = new Decode()
dec.run()
// But
// let f = dec.run
// f.apply(dec)
// f()
// doesn't work
