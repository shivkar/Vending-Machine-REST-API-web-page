 
 var moneyInput = 0;

$(document).ready(function () {
  
	
	  loadVendingItems();
	  
	  $('#add-dollar-button').on('click', function () {
        moneyInput += 1;
        messageBox("You added a Dollar");
        updateMoneyBox(moneyInput);
    });

	$('#add-quarter-button').on('click', function () {
        moneyInput += .25;
        messageBox("You added a Quarter")
        updateMoneyBox(moneyInput);
    });

    $('#add-dime-button').on('click', function () {
        moneyInput += .10;
        messageBox("You added a Dime");
        updateMoneyBox(moneyInput);
    });

    $('#add-nickel-button').on('click', function () {
        moneyInput += .05;
        messageBox("You added a Nickel")
        updateMoneyBox(moneyInput);
    });
	
	$('#make-purchase-button').click(function () {
        makePurchase();
    });
	
	$('#return-change').on('click', function () {
        changeReturn();
    });
	
	
	
	
  })
  
 
function loadVendingItems() {
	
	var vendingDiv = $('#vending-items');
	
    $.ajax({
		type: 'GET',
        url: ' http://vending.us-east-1.elasticbeanstalk.com/items ',
        success: function(vendingItemsArray) {
			vendingDiv.empty();
			
			$.each(vendingItemsArray, function (index, item) {
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;

        var vendingInfo = '<div class="itemDiv col-sm-4"  role="button" id="item'+ id +' " onclick="selectedItem(\'' + name + '\', '+ id + ')" style="text-align: left; margin-bottom: 30px; margin-top 30px">';
               
				vendingInfo += '<p style ="text-align: left">' + id + '</p>';
                vendingInfo += '<p><b>' + name + '</b></p>';
                vendingInfo += '<p>$' + price + '</p>';
                vendingInfo += '<p> Quantity Left: ' + quantity + '</p>';
                vendingInfo += '</div>';
				
                vendingDiv.append(vendingInfo);
            })
        },
        error: function() {
			            alert("Error Calling The Web Service. Please try again later.");

        }
    });
 
}

// function to help with storing an id for making a POST
// when #make-purchase-button is clicked

function selectedItem(name,id) {
    $('#item-field').val('('+ id +')' + name);
	$('#change-field').val('');
	 $('#vending-items').val(id); 
}


function messageBox(message) {
    $('#messages-field').val(message);
}
function updateMoneyBox(money) {

    $('#money-field').empty();
    $('#money-field').val(money.toFixed(2));
}

function makePurchase() {
    var money = $('#money-field').val();
    var item = $('#vending-items').val();

    $.ajax({
        type: 'POST',
        url: ' http://vending.us-east-1.elasticbeanstalk.com/money/' + money + '/item/' + item,
		
        headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			
			'dataType': 'json',
		
		success: function (returnMoney) {
            var change = $('#change-field');
            $('#messages-field').val(" Thank you!");
            var pennies = returnMoney.pennies;
            var nickels = returnMoney.nickels;
            var quarters = returnMoney.quarters;
            var dimes = returnMoney.dimes;
            var returnMessage = "";
			
            if (quarters != 0) {
                returnMessage += quarters + ' Quarter/s ';              
            }
            if (dimes != 0) {
                returnMessage += dimes + ' Dime/s ';                     
            }
            if (nickels != 0) {
                returnMessage += nickels + ' Nickel/s ';                 
            }
            if (pennies != 0) {
                returnMessage += pennies + ' Penny/ies ';              
            }
            if (quarters == 0 && dimes == 0 && nickels == 0 && pennies == 0) {
                returnMessage += "There is no change";                  
            }
            change.val(returnMessage);                                 
            $('#money-field').val('');
            loadVendingItems();
             moneyInput = 0;
        },
        error: function (error) {
            var errorMessage = error.responseJSON.message;
            messageBox(errorMessage);
        }
    });
}

function changeReturn() 
{
    var moneyInput= $('#money-field').val();
    var money = $('#money-field').val();

    var quarter = Math.floor(money / 0.25);
    money = (money - quarter * 0.25).toFixed(2);
    var dime = Math.floor(money / 0.10);
    money = (money - dime * 0.10).toFixed(2);
    var nickel = Math.floor(money / 0.05);
    money = (money - nickel * 0.05).toFixed(2);
    var penny = Math.floor(money / 0.01);
    money = (money - penny * 0.01).toFixed(2);

    var returnMessage = "";
    var vendingMessage = "";

    if (quarter != 0) {
        returnMessage += quarter + ' Quarter/s ';    
    }   
    if (dime != 0) {
        returnMessage += dime + ' Dime/s ';      
    }
    if (nickel != 0) {
        returnMessage += nickel + ' Nickel/s ';      
    }
    if (penny != 0) {
        returnMessage += penny + ' Penny/ies ';                   
    }

    if (quarter == 0 && dime == 0 && nickel == 0 && penny == 0) {
        returnMessage += "There is no change.";   
        vendingMessage = "No money was inputted.";             
    } else {
        vendingMessage = "Transaction cancelled. Money inputted ($" + moneyInput + ") is returned with change.";
    }

    moneyInput = 0;
    messageBox("");
    $('#messages-field').val(vendingMessage);
    $('#change-field').val(returnMessage);
    $('#item-field').val('');
    $('#money-field').val('');   
}
