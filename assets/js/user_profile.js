var files = document.getElementById("files");
console.log('hey');
files.onchange = function(event) {
   console.log('hie');
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }
  };
  