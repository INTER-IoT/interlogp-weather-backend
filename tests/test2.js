



const mifuncion = () => new Promise((accept, reject) => {
  accept(3);
});

(async () => {

  const a = await mifuncion();
  console.log(a);

  mifuncion().then(re => console.log(re));

})();