// Global variables
var acceptedChars = [' ',',','1','2','3','4','5','6','7','8','9','0'];
var prev_values;

var numb_array;
var n;

var theMean = 0;
var stdev = 0;
var sampStdev = 0;
var  min = 0;
var q1 = 0;
var median = 0;
var q3 = 0;
var max = 0;
var iqr = q3-q1;

// button to expand/unexpand details of results

var expandBut = jQuery('#expand-but').on('click', () => {
		if(expandBut.text()[0] == 'M'){
			expandBut.html('Less <i class="fa fa-chevron-up"></i>')
		}
		else{
			expandBut.html('More <i class="fa fa-chevron-down"></i>')

		}
	
		jQuery('.tr-expand').slideToggle();
	});

// function for mean
var calcMean = () => {
	
	var sum = numb_array.reduce((a, b) => a + b, 0);

	theMean = sum/n;
};


// function for Standard Deviation button
var calcStdev = function(){

 	calcMean();

	var sum = numb_array.reduce((a, b) => a + (b - theMean)**2, 0);

 	stdev = Math.sqrt(sum/n);
	
	sampStdev = Math.sqrt(sum/(n-1));
	
	
};

// function for getting median from an array
// (array, start index of array, end index of array)

var getMedian = (numb_arr, start, end) => {

    var index;
    var functionMedian;
    var n = end - start + 1;

    if(n%2 == 0){

        var index1 = n/2 -1 + start;
        index = index1 + .5;
        functionMedian = (numb_arr[index1] + numb_arr[index1 + 1]) / 2;

    }
    else{
        index= Math.floor(n/2) + start;
        functionMedian = numb_arr[index];
    }

    return {
        median: functionMedian,
        index: index,
    };
}


var calcStats = () => {
	
	jQuery('#error-div').slideUp();


    var numb_string = jQuery('#values').val();
	var numb_string_removes = numb_string.replace(/[\{\}\[\]\(\)]/g, "").replace(/[A-z]/g,"").replace(/,/g," ");
	console.log(numb_string_removes);

    var numb_array_split = numb_string_removes.split(' ');
	console.log(numb_array_split);
	numb_array = numb_array_split.filter(checkEmpty).map(Number);
	console.log(numb_array);
    n = numb_array.length;

    if(n<4){
        jQuery('#error-div').text('Please insert at least 4 numbers and try again').slideDown();
        jQuery('.answer-data').text('0');
		jQuery('#answer-n').text('oof... ');
		jQuery('#numb-array').text('Empty :(');

    }

    else{
        numb_array.sort(function(a, b){return a - b});

        jQuery('#numb-array').empty();
        jQuery('#numb-array').text(numb_array.join(', '));

        min = numb_array[0];
        max = numb_array[n-1];

        var medianValues = getMedian(numb_array,0,n-1);
        median = medianValues.median;
        var indexMedian = medianValues.index;
		
		jQuery('#q1-label').html('Q<sub>1</sub>: ');
        jQuery('#q3-label').html('Q<sub>3</sub>: ');
        jQuery('#iqr-label').html('IQR: ');
		
        if(n%2==0){
            var q1End = Math.floor(indexMedian);
            q1 = getMedian(numb_array, 0, q1End).median;
    
            var q3start = Math.ceil(indexMedian);
            q3 = getMedian(numb_array, q3start, n-1).median;
            iqr = q3-q1

        }
        else{
            var q1End = indexMedian-1;
            var q3start = indexMedian +1;

            q1 = getMedian(numb_array, 0, q1End).median;
            q3 = getMedian(numb_array, q3start, n-1).median;
            iqr = q3-q1;

            var q1_2 = getMedian(numb_array, 0, indexMedian).median;
            var q3_2 = getMedian(numb_array, indexMedian, n-1).median;
            iqr2 = q3_2 - q1_2;

            q1 = q1  + ' (method 1)<br>' + q1_2 + ' (method 2)';
            q3 = q3  + ' (method 1)<br>' + q3_2 + ' (method 2)';
            iqr = iqr + ' (method 1)<br>' + iqr2 + ' (method 2)';

        }

        calcStdev();

        var answers = [n,theMean, stdev, sampStdev, min, max, median, q1, q3, iqr];
        var answerSuffix = ['n', 'mean', 'stdev','samp-stdev','min', 'max', 'median', 'q1', 'q3','iqr'];

        for(i = 0; i <answerSuffix.length; i++){
            var text = '#answer-' + answerSuffix[i];
            jQuery(text).html(answers[i]);
        }
    }


}

// function to help remove spaces
function checkEmpty(strNum){
		return strNum != '';
}

// Give textarea the button get stats and doesnt add new line

jQuery('#values').keypress(function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
		
		calcStats();
    }
});

// Button on click function clear textarea

jQuery("#clear-btn").on('click', function(){
		jQuery('#values').val('');
		//console.log(jQuery('#values').val());
});

jQuery('#n').on('click', function(){
    jQuery('#numb-array').slideToggle();
	
	var showHideSpan = jQuery('#view-hide');
	var text = jQuery(showHideSpan).text();
	
	if(text == 'view'){
		jQuery(showHideSpan).text('hide');
	}
	else{
		jQuery(showHideSpan).text('view');
	}
	
})

jQuery("#getStats").on('click', calcStats);


// Setting the x's to 1-5
jQuery('#values').val('1,2 3  4,5');
calcStats();

