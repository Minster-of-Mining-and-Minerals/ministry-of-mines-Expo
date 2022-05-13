var properties = document.getElementById('properties');
var add_property = document.getElementById('add-property-btn');
var remove_property = document.getElementById('remove-property-btn');

var applications = document.getElementById('applications');
var add_application = document.getElementById('add-application-btn');
var field_buttons = document.getElementsByClassName('field-buttons');

add_property.onclick = function(){
  var newDiv = document.createElement('div');
  newDiv.setAttribute('class','form-column added-property');
  
  var newInput = document.createElement('input')
  newInput.setAttribute('type','text');
  newInput.setAttribute('name','text[]');
  newInput.setAttribute('class','form-control text-light bg-dark title-input');
  newInput.setAttribute('placeholder','Property Title');

  var newTextArea = document.createElement('textarea')
  newTextArea.setAttribute('class','form-control text-light bg-dark description-input');
  newTextArea.setAttribute('aria-label','With textarea');
  newTextArea.setAttribute('placeholder','Property Description');

  properties.appendChild(newDiv);
  newDiv.appendChild(newInput);
  newDiv.appendChild(newTextArea);

//  var removeBtn =  document.getElementById('remove-property-btn');
//   if (typeof(removeBtn) != 'undefined' && removeBtn != null){
//       // do nothing
//   }else{
//     var removeBtn = document.createElement('button');
//     removeBtn.setAttribute('type','button');
//     removeBtn.setAttribute('id','remove-property-btn');
//     removeBtn.setAttribute('class','btn btn-outline-dange btn-sm add-field');
//     removeBtn.innerText('Remove Property')

//     var removeIcn = document.createElement('i');
//     removeIcn.setAttribute('class','fa-solid fa-minus')

//     field_buttons.appendChild(removeBtn)
//     removeBtn.appendChild(removeIcn)
//   }
  
//   removeBtn.disabled = true;
}

// remove_fields.onclick = function(){
// //   var input_tags = survey_options.getElementsByClassName('form-column added-property');
  
// //   if(input_tags.length > 2) {
// //     var to_remove = input_tags[(input_tags.length) - 1]
    
// //     properties.removeChild(to_remove);
// //     to_remove.removeChild();
// //   }
// //   }
//     var myNode = document.getElementByByClassName('form-column added-property');
//     if (myNode.firstChild) {
//         myNode.removeChild(myNode.lastChild);
//     }
// }

add_application.onclick = function(){
    var newAppDiv = document.createElement('div');
    newAppDiv.setAttribute('class','form-column added-application');
    
    var newAppInput = document.createElement('input')
    newAppInput.setAttribute('type','text');
    newAppInput.setAttribute('name','text[]');
    newAppInput.setAttribute('class','form-control text-light bg-dark title-input');
    newAppInput.setAttribute('placeholder','Application Title');
  
    var newAppTextArea = document.createElement('textarea')
    newAppTextArea.setAttribute('class','form-control text-light bg-dark description-input');
    newAppTextArea.setAttribute('aria-label','With textarea');
    newAppTextArea.setAttribute('placeholder','Application Description');
  
    applications.appendChild(newAppDiv);
    newAppDiv.appendChild(newAppInput);
    newAppDiv.appendChild(newAppTextArea);
}