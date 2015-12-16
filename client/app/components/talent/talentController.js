(function () {
    'use strict';
    angular.module('talentController', ['talentFactory', 'contactFactory', 'roleFactory', 'genreFactory', 'commentFactory', 'talentGridFactory', 'ethnicityFactory'])
        .controller('talentController', function ($scope, talentFactory, contactFactory, creditFactory, roleFactory, genreFactory, commentFactory, talentGridFactory, ethnicityFactory) {

            ///////////////////////////////
            /// Initialize View
            ///////////////////////////////
             $scope.incomeMultiple = [
                 {"id": 1,"name": 1}, {"id": 2,"name": 2},
                 {"id": 3,"name": 3}, {"id": 4,"name":4},
                 {"id": 5,"name":5}
             ];
            $scope.budgets = [
                 {"id": 1,"name": "Under $250K"}, {"id": 2,"name": "$250K-$1M"},
                 {"id": 3,"name": "$1M-$5M"}, {"id": 4,"name":"$5M-$10M"},
                 {"id": 5,"name":"$10M-$50M"},{"id": 6,"name":"$50M-$100M"},
                 {"id": 7,"name":"Above $100M"}
             ];
            $scope.ages = [
                 {"id": 1,"name": "Less than 20"}, {"id": 2,"name": "20-30"},
                 {"id": 3,"name": "30-40"}, {"id": 4,"name": "40-50"},
                 {"id": 5,"name": "over 50"}
             ];
             
            $scope.term ="";
            var filereName = $scope.term;
            $scope.talentGridOption = {};
            $scope.activeSectionInfo = false;
            $scope.filerByname = "";
            var Rolls = [];
            var Genres = [];
            $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
                    if( col.filters[0].term ){
                        return 'header-filtered';
                    } else {
                        return '';
                    }
            };
            $scope.gridData = [];
            $scope.talentGridOption = talentGridFactory.getGridOptions();

            function numberFormatter(num) {
                if (num >= 1000000000) {
                    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
                }
                if (num >= 1000000) {
                    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                }
                if (num >= 1000) {
                    return (num / 1000).toFixed(0).replace(/\.0$/, '') + 'K';
                }
                return num;
            }

            function getNumber(inputStr){
                var numberValue = Number(inputStr .replace(/[^0-9\.]+/g,""));
                return parseInt(numberValue);
            }

            talentFactory.getAll(function (data) {
                angular.forEach(data,function(items){
                    if(items.estimatedBudget !==null && items.estimatedBudget){
                        var estimatedBudgets = items.estimatedBudget.split(',');
                        var maxBudget = Math.max.apply(Math, estimatedBudgets);
                        maxBudget = numberFormatter(parseInt(maxBudget));
                        var minBudget = Math.min.apply(Math, estimatedBudgets);
                        minBudget = numberFormatter(parseInt(minBudget));
                        minBudget = minBudget === 0 ? "Not Available":'$'+minBudget;
                        maxBudget = maxBudget === 0 ? "Not Available":'$'+maxBudget;
                        items.estimatedBudgetMin = minBudget;
                        items.estimatedBudgetMax = maxBudget;
                        //items.estimatedBudget = '$'+minBudget+'-'+'$'+maxBudget;
                    }else if(items.estimatedBudget ===null && !items.estimatedBudget){
                        items.estimatedBudgetMin = null;
                        items.estimatedBudgetMax = null;
                    }
                    if(items.boxOfficeIncome !==null && items.boxOfficeIncome){
                        var boxOfficeIncomes = items.boxOfficeIncome.split(',');
                        var maxIncome = Math.max.apply(Math, boxOfficeIncomes);
                        maxIncome = numberFormatter(parseInt(maxIncome));
                        var minIncome = Math.min.apply(Math, boxOfficeIncomes);
                        minIncome = numberFormatter(parseInt(minIncome));
                        minIncome = minIncome === 0 ? "Not Available":'$'+minIncome;
                        maxIncome = maxIncome === 0 ? "Not Available":'$'+maxIncome;
                        items.boxOfficeIncomeMin = minIncome;
                        items.boxOfficeIncomeMax = maxIncome;
                    }else if(items.boxOfficeIncome ===null && !items.boxOfficeIncome){
                        items.boxOfficeIncomeMin = null;
                        items.boxOfficeIncomeMax = null;
                    }

                });
                $scope.talentGridOption.data = data;
                $scope.gridData = data;
                $scope.filteredRows = data;
                $scope.talentCount = data.length;
                $scope.visibleTalent = data.length;
                $('.talent-right-container-content').hide();
                $("span.ui-grid-pager-row-count-label").text(" Records per page");
            });

            $scope.mainTalent = false;
            $scope.activeSection = 'info';
            $scope.filterColumn = 'last_name';
            $scope.deletedComments = 0;
            $scope.talentGridOption.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        if(row.isSelected){
                            updateMainTalent(row.entity.id);
                            $('.talent-right-container-content').show();
                        }
                        if(!row.isSelected){
                            $scope.gridApi.selection.clearSelectedRows();
                            $('.talent-right-container-content').hide();
                        }
                    });
            };
             $scope.updateFiltersByChckBox = function ($event) {
                if(!angular.isUndefined($event)){
                    if($($event.target).hasClass( "role-list-class" )){
                        $("input#allRole").prop("checked",false);
                    }
                    if($($event.target).hasClass( "genre-list-class" )){
                        $("input#allGenres").prop("checked",false);
                    }
                    if($($event.target).hasClass( "gender-input" )){
                        $("input#allGender").prop("checked",false);
                    }
                    if($($event.target).hasClass( "age-list-class" )){
                        $("input#allAges").prop("checked",false);
                    }
                    if($($event.target).hasClass( "budget-list-class" )){
                        $("input#allBudget").prop("checked",false);
                    }
                    if($($event.target).hasClass( "BoxOfficeIncome-list-class" )){
                        $("input#allBoxRevenue").prop("checked",false);
                    }
                    if($($event.target).hasClass( "BoxOfficeIncome-list-class" )){
                        $("input#allBoxRevenue").prop("checked",false);
                    }
                    if($($event.target).hasClass( "ethnicity-list-class" )){
                        $("input#allEthnicity").prop("checked",false);
                    }
                    if($($event.target).hasClass( "createdby-list-class" )){
                        $("input#allCreatedBy").prop("checked",false);
                    }
                    if($($event.target).hasClass( "country-list-class" )){
                        $("input#allCountries").prop("checked",false);
                    }
                    if($($event.target).hasClass( "awards-list-class" )){
                        $("input#allAwards").prop("checked",false);
                    }

                    if($event.target.id==="allRole" && $event.target.checked){
                            $('div#role_list input').each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allRole").prop("checked",true);
                    }
                    if($event.target.id==="allGenres" && $event.target.checked){
                            $('div#genre_list input').not(this).each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allGenres").prop("checked",true);
                    }
                     if($event.target.id==="allGender" && $event.target.checked){

                            $('div#gender_list input').each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allGender").prop("checked",true);
                    }
                    if($event.target.id==="allAges" && $event.target.checked){

                            $('div#age_list input').each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allAges").prop("checked",true);
                    }
                    if($event.target.id==="allAwards" && $event.target.checked){

                            $('div#awards_list input').each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allAwards").prop("checked",true);
                    }
                    if($event.target.id==="allCountries" && $event.target.checked){

                            $('div#country_list input').each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allCountries").prop("checked",true);
                    }
                    if($event.target.id==="allBudget" && $event.target.checked){
                            $('div#budget_list input').each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allBudget").prop("checked",true);
                    }
                    if($event.target.id==="allBoxRevenue" && $event.target.checked){
                            $('div#box_office_income_list input').each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allBoxRevenue").prop("checked",true);
                    }
                    if($event.target.id==="allEthnicity" && $event.target.checked){
                            $('div#ethnicity_list input').each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allEthnicity").prop("checked",true);
                    }
                    if($event.target.id==="allCreatedBy" && $event.target.checked){
                            $('div#createdby_list').each(function () {
                                 $(this).prop("checked",false);
                            });
                            $("input#allCreatedBy").prop("checked",true);
                    }
                }
                $scope.talentGridOption.data = _.filter( $scope.gridData, function (item) {
                    var findNameFlag = false;
                    var findCountryFlag = false;
                    var findRoleFlag = false;
                    var findCreatedByFlag = false;
                    var findAgeFlag = false;
                    var findEthnicityFlag = false;
                    var findGenresFlag = false;
                    var findGenderFlag =false;
                    var findBudgetFlag = false;
                    var findBoxOfficeIncomeFlag = false;
                    var findAwardsFlag = false;
                    var findFlag = false;
                    var findRatioFlag = false;
                    var selectedNames ="";
                    var validNameInput = ($scope.filerByname!==null) && !(angular.isUndefined($scope.filerByname)) && ($scope.filerByname !=="");
                    var isValidOptionRatio = ($scope.budgetMultipleOption!==null) && !(angular.isUndefined($scope.budgetMultipleOption)) && ($scope.budgetMultipleOption !=="");
                    var isValidRatio = ($scope.incomeMultipleInput!==null) && !(angular.isUndefined($scope.incomeMultipleInput)) && !isNaN($scope.incomeMultipleInput) && ($scope.incomeMultipleInput !=="");
                    if(validNameInput){
                        selectedNames = $scope.filerByname;
                        if(item.name !==null){
                            if(item['name'].toLowerCase().search(selectedNames)!==-1){
                                findNameFlag = true;
                            }
                        }
                    }
                    if(isValidRatio && isValidOptionRatio){
                        selectedNames = $scope.filerByname;
                        var inputRatio = parseFloat($scope.incomeMultipleInput).toFixed(1);
                        var seletedRatio = ($scope.budgetMultipleOption).toLowerCase();
                        var boxbudgetratio = "";
                        if(item.boxbudgetratio !==null){
                            if(seletedRatio==="maxgreaterorequal"){
                                boxbudgetratio = item['boxbudgetratio'].split(',');
                                var maxRatio = parseFloat(Math.max.apply(Math, boxbudgetratio)).toFixed(1);
                                console.log(inputRatio);
                                console.log(maxRatio);
                                var test = maxRatio >=inputRatio;
                                console.log(test);
                                if(maxRatio >= inputRatio){
                                    findRatioFlag = true;
                                }

                            }else if(seletedRatio==="mingreaterorequal"){
                                boxbudgetratio = item['boxbudgetratio'].split(',');
                                var minRatio = parseFloat(Math.min.apply(Math, boxbudgetratio)).toFixed(1);;
                                if(minRatio >=inputRatio){
                                    findRatioFlag = true;
                                }

                            }else{
                                boxbudgetratio = item['boxbudgetratio'].split(',');
                                var totalAvg=0;
                                for(var i in boxbudgetratio) { totalAvg += boxbudgetratio[i]; }
                                totalAvg = parseFloat(totalAvg/(boxbudgetratio.length-1)).toFixed(1);
                                if(totalAvg >=inputRatio){
                                    findRatioFlag = true;
                                }

                            }
                        }
                    }
                    if(item.roles !==null){
                        $('div#role_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            if((item['roles'].toLowerCase()).indexOf(selectedNames.toLowerCase()) !==-1){
                                    findRoleFlag = true;
                            }
                        });                      
                    }
                    if(item.genres !==null){
                        $('div#genre_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            if((item['genres'].toLowerCase()).indexOf(selectedNames.toLowerCase()) !==-1){
                                    findGenresFlag = true;
                            }
                        });                      
                    }
                    if(item.gender !==null){
                        $('div#gender_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            if((item['gender'].toLowerCase())===selectedNames.toLowerCase()){
                                    findGenderFlag = true;
                            }
                        });                      
                    }
                    if(item.awards !==null){
                        $('div#awards_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            if((item['awards'].toLowerCase()).indexOf(selectedNames.toLowerCase()) !==-1){
                                    findAwardsFlag = true;
                            }
                        });                      
                    }
                    if(item.country !==null){
                        $('div#country_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            if((item['country'].toLowerCase())===selectedNames.toLowerCase()){
                                    findCountryFlag = true;
                            }
                        });                      
                    }
                    if(item.createdby !==null){
                        $('div#createdby_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            if((item['createdby'].toLowerCase())===selectedNames.toLowerCase()){
                                    findCreatedByFlag = true;
                            }
                        });                      
                    }

                    if(item.age !==null){
                        $('div#age_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            selectedNames = selectedNames.replace(/ /g,'').toLowerCase();
                            if(selectedNames ==="lessthan20"){
                                if(parseInt(item['age']) < 20){
                                    findAgeFlag = true;
                                }
                            }
                            if(selectedNames ==="20-30"){
                                if(parseInt(item['age']) >= 20 && parseInt(item['age']) < 30){
                                    findAgeFlag = true;
                                }
                            }
                            if(selectedNames ==="30-40"){
                                if(parseInt(item['age']) >= 30 && parseInt(item['age']) < 40){
                                    findAgeFlag = true;
                                }
                            }
                            if(selectedNames ==="40-50"){
                                if(parseInt(item['age']) >= 40 && parseInt(item['age']) < 50){
                                    findAgeFlag = true;
                                }
                            }
                            if(selectedNames ==="over50"){
                                if(parseInt(item['age']) >= 50){
                                    findAgeFlag = true;
                                }
                            }

                        });
                    }

                    if((item.estimatedBudgetMin !==null && item.estimatedBudgetMax !==null) && (item.estimatedBudgetMin !=="Not Available" && item.estimatedBudgetMax !=="Not Available")){
                        $('div#budget_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            selectedNames = selectedNames.replace(/ /g,'').toLowerCase();
                            // var budgets = item['estimatedBudget'].split('-');
                            // var lowerLimit = budgets[0];
                            // var upperLimit = budgets[1];
                            var lowerLimitDigit = getNumber(item['estimatedBudgetMin']);
                            var upperLimitDigit = getNumber(item['estimatedBudgetMax']);
                            var lowerLimitSuffix = item['estimatedBudgetMin'].slice(-1).toLowerCase();
                            var upperLimitSuffix = item['estimatedBudgetMax'].slice(-1).toLowerCase();
                            if(selectedNames ==="under$250k" && (upperLimitSuffix ==="k" || upperLimitSuffix==="0")){
                                if(upperLimitDigit < 250){
                                    findBudgetFlag = true;
                                }
                            }
                            if(selectedNames ==="$250k-$1m" && lowerLimitSuffix ==="k" && upperLimitSuffix==="k"){
                                if(lowerLimitDigit >= 250 && upperLimitDigit<= 999999){
                                    findBudgetFlag = true;
                                }
                            }
                            if(selectedNames ==="$1m-$5m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(lowerLimitDigit >= 1 && upperLimitDigit< 5){
                                    findBudgetFlag = true;
                                }
                            }
                            if(selectedNames ==="$5m-$10m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(lowerLimitDigit >= 5 && upperLimitDigit< 10){
                                    findBudgetFlag = true;
                                }
                            }
                            if(selectedNames ==="$10m-$50m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(lowerLimitDigit >= 10 && upperLimitDigit< 50){
                                    findBudgetFlag = true;
                                }
                            }
                            if(selectedNames ==="$50m-$100m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(lowerLimitDigit >= 50 && upperLimitDigit< 100){
                                    findBudgetFlag = true;
                                }
                            }
                            if(selectedNames ==="above$100m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(upperLimitDigit>= 100){
                                    findBudgetFlag = true;
                                }
                            }
                            
                        });
                    }
                    if((item.boxOfficeIncomeMin !==null && item.boxOfficeIncomeMax !==null) && (item.boxOfficeIncomeMin !=="Not Available" && item.boxOfficeIncomeMax !=="Not Available")){
                        $('div#box_office_income_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            selectedNames = selectedNames.replace(/ /g,'').toLowerCase();
                            // var budgets = item['boxOfficeIncome'].split('-');
                            // var lowerLimit = budgets[0];
                            // var upperLimit = budgets[1];
                            var lowerLimitDigit = getNumber(item['boxOfficeIncomeMin']);
                            var upperLimitDigit = getNumber(item['boxOfficeIncomeMax']);
                            var lowerLimitSuffix = item['boxOfficeIncomeMin'].slice(-1).toLowerCase();
                            var upperLimitSuffix = item['boxOfficeIncomeMax'].slice(-1).toLowerCase();
                            if(selectedNames ==="under$250k" && (upperLimitSuffix ==="k" || upperLimitSuffix==="0")){
                                if(upperLimitDigit < 250){
                                    findBoxOfficeIncomeFlag = true;
                                }
                            }
                            if(selectedNames ==="$250k-$1m" && lowerLimitSuffix ==="k" && upperLimitSuffix==="k"){
                                if(lowerLimitDigit >= 250 && upperLimitDigit<= 999999){
                                    findBoxOfficeIncomeFlag = true;
                                }
                            }
                            if(selectedNames ==="$1m-$5m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(lowerLimitDigit >= 1 && upperLimitDigit< 5){
                                    findBoxOfficeIncomeFlag = true;
                                }
                            }
                            if(selectedNames ==="$5m-$10m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(lowerLimitDigit >= 5 && upperLimitDigit< 10){
                                    findBoxOfficeIncomeFlag = true;
                                }
                            }
                            if(selectedNames ==="$10m-$50m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(lowerLimitDigit >= 10 && upperLimitDigit< 50){
                                    findBoxOfficeIncomeFlag = true;
                                }
                            }
                            if(selectedNames ==="$50m-$100m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(lowerLimitDigit >= 50 && upperLimitDigit< 100){
                                    findBoxOfficeIncomeFlag = true;
                                }
                            }
                            if(selectedNames ==="above$100m" && lowerLimitSuffix ==="m" && upperLimitSuffix==="m"){
                                if(upperLimitDigit>= 100){
                                    findBoxOfficeIncomeFlag = true;
                                }
                            }
                            
                        });
                    }

                    if(item.ethnicity !==null){
                        $('div#ethnicity_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            if((item['ethnicity'].toLowerCase())===selectedNames.toLowerCase()){
                                findEthnicityFlag = true;
                            }
                        });
                    }

                    if(!validNameInput){
                        findNameFlag = true;
                    }
                    if(!isValidRatio || !isValidOptionRatio){
                        findRatioFlag = true;
                    }
                    if($("input#allRole").is(':checked')){
                        findRoleFlag = true;
                    }
                    if($("input#allCountries").is(':checked')){
                        findCountryFlag = true;
                    }
                    if($("input#allAwards").is(':checked')){
                        findAwardsFlag = true;
                    }
                    if($("input#allGenres").is(':checked')){
                        findGenresFlag = true;
                    }
                    if($("input#allGender").is(':checked')){
                        findGenderFlag = true;
                    }
                    if($("input#allCreatedBy").is(':checked')){
                        findCreatedByFlag = true;
                    }
                    if($("input#allAges").is(':checked')){
                        findAgeFlag = true;
                    }
                    if($("input#allEthnicity").is(':checked')){
                        findEthnicityFlag = true;
                    }
                    if($("input#allBudget").is(':checked')){
                        findBudgetFlag = true;
                    }
                    if($("input#allBoxRevenue").is(':checked')){
                        findBoxOfficeIncomeFlag = true;
                    }
                    if(findNameFlag && findRoleFlag && findGenresFlag && findGenderFlag && findCountryFlag && findCreatedByFlag && findEthnicityFlag && findAgeFlag && findBudgetFlag && findBoxOfficeIncomeFlag && findRatioFlag && findAwardsFlag){
                        findFlag = true;
                    }
                    return findFlag;
                });
            };
            var updateMainTalent = function (talentId) {
                $scope.deletedComments = 0;
                talentFactory.talentProfile(talentId, function (result) {
                	$scope.mainTalent = result[0];
                	$scope.id = (result.details[0].id) ? result.details[0].id:'';
                    var phoneNumber = (result.details[0].phone) ? result.details[0].phone:'';
                    if(phoneNumber !== null){
                    	var formattedNo = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                    }else{
                    	var formattedNo = '';
                    }
                    $scope.phone = formattedNo;
                    $scope.email = (result.details[0].email) ? result.details[0].email :'';
                    
                    $scope.facebookurl = (result.details[0].facebookurl) ? 'http://www.'+result.details[0].facebookurl:'';
                    $scope.instagramurl = (result.details[0].instagramurl) ?'http://www.'+result.details[0].instagramurl:'';
                    $scope.twitterurl = (result.details[0].twitterurl) ?'http://www.'+result.details[0].twitterurl:'';
                    $scope.vineurl = (result.details[0].vineurl) ? 'http://www.'+result.details[0].vineurl:'';
                    $scope.youtubeurl = (result.details[0].youtubeurl) ?'http://www.'+result.details[0].youtubeurl:'';
                    
                    $scope.creditsData = [];
                    var creditObj = {};
                    var creditArray = [];
                    if(!!result.credits && result.credits.length>0){
                    	angular.forEach(result.credits, function(value, key) {
                    		creditObj.title = (value.creditname === null) ? 'Not Available' : value.creditname;
                    		creditObj.releasedate = (value.release_date === null) ? 'Not Available' : value.release_date;
                    		creditObj.roll = (value.rolename === null) ? 'Not Available' : value.rolename;
                    		creditObj.budget = (value.estimatedBudget === 0) ? 'Not Available' : '$'+value.estimatedBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    		creditObj.boxoffice = (value.box_office_income === 0) ? 'Not Available' : '$'+value.box_office_income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    		creditArray.push(creditObj);
                    		creditObj = {};
                    	});
                    	$scope.creditsData = creditArray;
                    }
                    
                    $scope.awardsData = [];
                    var awardObj = {};
                    var awardsArray = [];
                    if(!!result.awards && result.awards.length>0){
                    	angular.forEach(result.awards, function(value, key) {
                    		awardObj.name = (value.awardname === null) ? 'Not Available' : value.awardname;
                    		awardObj.year = (value.release_date === null) ? 'Not Available' : value.release_date;
                    		awardObj.type = (value.awardtype === null) ? 'Not Available' : value.awardtype;
                    		awardObj.credit = (value.name === null) ? 'Not Available' : value.name;
                    		awardObj.awardfor = (value.awardfor === null) ? 'Not Available' : value.awardfor;
                    		awardsArray.push(awardObj);
                    		awardObj = {};
                    	});
                    	$scope.awardsData = awardsArray;
                    }
                    
                    $scope.commentsData = [];
                    var commentObj = {};
                    var commentArray = [];
                    if(!!result.comments && result.comments.length>0){
                    	angular.forEach(result.comments, function(value, key) {
                    		commentObj.text = value.text;
                    		commentObj.name = value.name;
                    		commentObj.date = value.date;
                    		commentObj.comment_id = value.comment_id;
                    		commentArray.push(commentObj);
                    		commentObj = {};
                    	});
                    	$scope.commentsData = commentArray;
                    }
                                        
                    $scope.associateData = [];
                    var associateObj = {};
                    var associateArray = [];
                    if(result.details[0].associateInfo!==null){
                        var associateDataObj = result.details[0].associateInfo.split('|');
                        angular.forEach(associateDataObj, function(value, key) {
                      	  if(value){
                      		var vals = value.trim().split(',');
                      		angular.forEach(vals, function(value2, key2) {
                      			if(key2 === 0){
                      				associateObj.associatename = value2.trim();
                  				}
                      			if(key2 === 1){
                      				associateObj.firstname = value2.trim();
                  				}
                      			if(key2 === 2){
                      				associateObj.lastname = value2.trim();
                  				}
                  			});
                      		associateArray.push(associateObj);
                      		associateObj = {};
                      	  }
                      	});
                        $scope.associateData = associateArray;
                    }
                    
                    $('.right-talent-container-menu-link').removeClass('active-talent-link');
                    $("#infoTab").addClass('active-talent-link');
                    $scope.activeSectionInfo = 'info';
                });
                $('.active-talent').each(function () {
                    $(this).removeClass('active-talent');
                });
            };


            $scope.updateTalentSection = function ($event, section) {
                $('.right-talent-container-menu-link').removeClass('active-talent-link');
                $($event.target).addClass('active-talent-link');
                $scope.activeSectionInfo = section;
            };

           
            $scope.updateFiltersKeyUp = function ($event) {
                $scope.filterData[$($event.target).attr('col')] = $($event.target).val();
                updateVisibleCount();
            };

            $scope.filterData = {
                name: "",
                location: "",
                partner: "",
                primary_role: {"*": true},
                secondary_role: {"*": true},
                primary_genre: {"*": true},
                secondary_genre: {"*": true}
            };

            // Storage for all data points for filters
            $scope.data = {
                Role: roleFactory.getNames(function (result) {
                    $scope.data.Role = result;
                    $scope.data.RolePriority = []; 
                    $scope.data.RoleNonPriority = [];
                    $scope.activeData = $scope.data.Role;
                    angular.forEach(result,function(items){
                       var getPeiorityRoll =  (items.name.trim() ==="Actor" || items.name.trim() ==="Director" || items.name.trim() ==="Producer" || items.name.trim() ==="Writer");
                       if(getPeiorityRoll){
                            $scope.data.RolePriority.push(items);
                       }else{
                             $scope.data.RoleNonPriority.push(items);
                       }
                    });
                    for (var i = 0; i < result.length; i++) {
                        $scope.filterData['primary_role'][result[i].name] = false;
                        $scope.filterData['secondary_role'][result[i].name] = false;
                    }
                }),
                TalentCreatedBy: talentFactory.getAllCreatedBy(function (result) {
                    $scope.data.createdByNames = result;
                }),
                TalentAwards: talentFactory.getAwardsNames(function (result) {
                    $scope.data.awardsNameList = result;
                }),
                TalentCountryNames: talentFactory.getCountryNames(function (result) {
                    $scope.data.countryNames = result;
                }),
                Genre: genreFactory.getNames(function (result) {
                    $scope.data.GenrePriority = []; 
                    $scope.data.GenreNonPriority = [];
                    $scope.data.Genre = result;
                    angular.forEach(result,function(items){
                        var matchFound  = (items.name.trim() ==="Action" || items.name.trim() ==="Comedy" || items.name.trim() ==="Drama" || items.name.trim() ==="Horror" || items.name.trim() ==="Musical" || items.name.trim() ==="Thriller");
                        if(matchFound){
                            $scope.data.GenrePriority.push(items);
                        }else{
                            $scope.data.GenreNonPriority.push(items);

                        }
                    });
                    $scope.activeData = $scope.data.Genre;
                    for (var i = 0; i < result.length; i++) {
                        $scope.filterData['primary_genre'][result[i].name] = false;
                        $scope.filterData['secondary_genre'][result[i].name] = false;
                    }
                }),
                Ethnicity: ethnicityFactory.getNames(function (result) {
                        $scope.data.Ethnicities = result;
                })
            };

            // Toggles all checkboxes to true
            $scope.checkAll = function () {
                $('.filter-option').prop('checked', true);
                for (var col in $scope.filterData) {
                    if (typeof($scope.filterData[col]) === "object") {
                        for (var elem in $scope.filterData[col]) {
                            $scope.filterData[col][elem] = true;
                        }
                    }
                }
            };

            // Toggles all checkboxes to false
            $scope.uncheckAll = function () {
                $('.filter-option').prop('checked', false);
                for (var col in $scope.filterData) {
                    if (typeof($scope.filterData[col]) === "object") {
                        for (var elem in $scope.filterData[col]) {
                            $scope.filterData[col][elem] = false;
                        }
                    }
                }
            };

            // Changes the ordering of visible data
            $scope.changeOrder = function (column) {
                // If you click the column that is already being used to filter
                if ($scope.filterColumn === column) {
                    // Reverse the filter
                    $scope.filterColumn = "-" + column;
                    // If you are already filtering by the inverse, reset the filter to last_name (default)
                } else if ($scope.filterColumn === "-" + column) {
                    $scope.filterColumn = "last_name";
                    // Reset active header color to the name column
                    $('.active-header').removeClass('active-header');
                    $('.col-header[col="last_name"]').addClass('active-header');
                } else {
                    $scope.filterColumn = column;
                    // Change header color to new column being used to sort
                    $('.active-header').removeClass('active-header');
                    $('.col-header[col="' + column + '"]').addClass('active-header');
                }
            };

            // Determines whether a talent matches text in Name or Location (if these fields are not blank)
            var textChecker = function (talent) {

                // If text is inputted for name and it isn't a match, return false (we don't check if field is blank because it can't be based on form validation)
                if ($scope.filterData.name.length > 0 && talent.name.toLowerCase().indexOf($scope.filterData.name.toLowerCase()) === -1) {
                    return false;
                }

                // If text is inputted for location and it isn't a match, return false
                if ($scope.filterData.location.length > 0 && (talent.location === null || talent.location.toLowerCase().indexOf($scope.filterData.location.toLowerCase()) === -1)) {
                    return false;
                }

                // If text is inputted for location and it isn't a match, return false
                if ($scope.filterData.partner.length > 0 && (talent.partner === null || talent.partner.toLowerCase().indexOf($scope.filterData.partner.toLowerCase()) === -1)) {
                    return false;
                }

                // Otherwise, it's a valid match
                return true;
            };

            // Filter for talent
            $scope.talentFilter = function (talent) {
                return textChecker(talent)
                    && ($scope.filterData.primary_role['*'] || $scope.filterData.primary_role[talent.primary_role])
                    && ($scope.filterData.secondary_role['*'] || $scope.filterData.secondary_role[talent.secondary_role])
                    && ($scope.filterData.primary_genre['*'] || $scope.filterData.primary_genre[talent.primary_genre])
                    && ($scope.filterData.secondary_genre['*'] || $scope.filterData.secondary_genre[talent.secondary_genre])
                    ;
            };

            $scope.submitComment = function () {
                // If text is in the textarea, submit the new comment
                if ($('.comment-input').val() !== "") {
                	$scope.commentMsg = '';
					$scope.sweetAlert;
                	$scope.comStatus = false;
                	var commentObj = {};
                    commentFactory.addComment($('.comment-input').val(), $scope.id, function (result) {
                    	$scope.commentsData.unshift(result);
                        $('.comment-input').val('');
                    });
                }
            };
            $scope.removeComment = function ($event, comment_id) {
            	var r = confirm("Do you really want to delete this comment?");
            	if (r == true) {
            		$($event.target).parent().slideUp();
                    commentFactory.removeComment(comment_id);
                    $scope.deletedComments++;
            	} else {
            	    //return false;
            	}
            };

           

            // Updates visible talent count on th upper left
            var updateVisibleCount = function () {
                setTimeout(function () {
                    $scope.visibleTalent = $('.talent-table-row').length;
                    $scope.$apply();
                }, 100);

            };

            // JQuery

            // Expand/collapse checkbox containers
            $(document).on('click', '.filter-header-container', function () {
                if ($(this).next('.filter-option-container').is(':visible')) {
                    $(this).next('.filter-option-container').hide();
                } else {
                    $(this).next('.filter-option-container').show();
                }
                // $(this).next('.filter-option-container').slideToggle();
                $(this).find('.arrow').toggleClass('arrow-down');

                $('.talent-left-col-container').hide();
                $('.talent-left-col-container').show();
            });



        });
})();