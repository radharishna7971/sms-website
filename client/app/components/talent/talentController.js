(function () {
    'use strict';
    angular.module('talentController', ['talentFactory', 'contactFactory', 'roleFactory', 'genreFactory', 'commentFactory', 'talentGridFactory', 'ethnicityFactory'])
        .controller('talentController', function ($scope, $q, talentFactory, contactFactory, creditFactory, roleFactory, genreFactory, commentFactory, talentGridFactory, ethnicityFactory) {

            ///////////////////////////////
            /// Initialize View
            ///////////////////////////////
            $('.filter-header-container').find('.arrow').removeClass( "arrow-down" );
            $('.filter-header-container').find('.arrow').addClass( "arrow-right" );
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
            $scope.showmsg= {};
            $scope.showPopUp = false;
            $scope.getTalentData = {};
             // This contains functions for submitting data to the database
    var dataSubmitter = {
          Talent: function() {
            if (!checkInputs('talent')) {
              $scope.showmsg.errorText = 'Please make sure all required fields are entered';
            } else {
              // Set blank values to null so they can be properly saved in database
              for (var key in $scope.activeElement) {
                if (!$scope.activeElement[key]) {
                  $scope.activeElement[key] = null;
                }
              }

              if (!$scope.activeElement.created_by) {
                $scope.activeElement.created_by = window.localStorage.smstudiosId;
              }
              if (!$scope.activeElement.createdby) {
                $scope.activeElement.createdby = window.localStorage.smstudiosLoginUserName;
              }
              if (!$scope.activeElement.createdbycomments) {
                $scope.activeElement.createdbycomments = window.localStorage.smstudiosLoginUserName;
              }
              $scope.activeElement.modifiedby = window.localStorage.smstudiosLoginUserName;
     

              // Add id to keep track of who created given talent
              $scope.activeElement.last_edited_by = window.localStorage.smstudiosId;
              $scope.activeElement.last_edited = moment().format('YYYY-MM-DD HH:mm:ss');

              talentFactory.addOrEdit($scope.activeElement, function(res) {
                if (res.status !== 'error') {
                  if (res.status === 'edit') {
                    //$scope.editElement.name = res.name;
                  } else {
                    // $scope.data[$scope.section].push(res);
                     //  $scope.editElement = res;
                     //  activeElementSetter[$scope.section]();
                     // $scope.btnTxt = "Update";               
                  }
                }
                $scope.showmsg.errorText = res.text;
              });
            }
          }
        };
            $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
                    if( col.filters[0].term ){
                        return 'header-filtered';
                    } else {
                        return '';
                    }
            };
            $scope.gridData = [];
            $scope.talentGridOption = talentGridFactory.getGridOptions();
            $scope.section = 'Talent';
            $scope.talentSection = 'main';
            $scope.showPopUp = '';
            $scope.showsection = function($event,sectioname) {
                if (!$($event.target).hasClass('talent-form-menu-button-inactive')) {
                    $('.talent-form-menu-button-active').removeClass('talent-form-menu-button-active');
                    $($event.target).addClass('talent-form-menu-button-active');
                }
                $scope.talentSection = sectioname;

            };
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

            contactFactory.getAssociateNames(function(result) {
                $scope.data.Contact = result;
            });

            talentFactory.getAll(function (data) {

                angular.forEach(data,function(items){
                    if(items.estimatedBudget !==null && items.estimatedBudget){
                        var estimatedBudgets = items.estimatedBudget.split(',');
                        var maxBudget = Math.max.apply(Math, estimatedBudgets);
                        maxBudget = numberFormatter(parseInt(maxBudget));
                        var minBudget = Math.min.apply(Math, estimatedBudgets);
                        minBudget = numberFormatter(parseInt(minBudget));
                        var estimatedBudgetVal = '$'+minBudget+'-'+'$'+maxBudget
                        if(!minBudget && !maxBudget){
                            estimatedBudgetVal = "Not Available";
                        }else if(minBudget===maxBudget){
                            estimatedBudgetVal = '$'+minBudget;
                        }
                        items.estimatedBudget = estimatedBudgetVal;
                    }
                    if(items.boxOfficeIncome !==null && items.boxOfficeIncome){
                        var boxOfficeIncomes = items.boxOfficeIncome.split(',');
                        var maxIncome = Math.max.apply(Math, boxOfficeIncomes);
                        maxIncome = numberFormatter(parseInt(maxIncome));
                        var minIncome = Math.min.apply(Math, boxOfficeIncomes);
                        minIncome = numberFormatter(parseInt(minIncome));
                        var boxOfficeIncome = '$'+minIncome+'-'+'$'+maxIncome;
                        if(!minBudget && !maxBudget){
                            boxOfficeIncome = "Not Available";
                        }else if(minBudget === maxBudget){
                            boxOfficeIncome = '$'+minBudget;
                        }
                        items.boxOfficeIncome = boxOfficeIncome;
                    }
                    if(items.boxbudgetratio==="0.0"){
                        items.boxbudgetratio = "Not Available";
                    }
                    if(items.boxbudgetratio !==null && items.boxbudgetratio){
                        var incomeMultiple = items.boxbudgetratio.split(',');
                        var maxIncomeMul = Math.max.apply(Math, incomeMultiple);
                        //maxIncomeMul = numberFormatter(parseInt(maxIncomeMul));
                        var minIncomeMul = Math.min.apply(Math, incomeMultiple);
                        //minIncomeMul = numberFormatter(parseInt(minIncomeMul));
                        var incomeMulStr = minIncomeMul+'-'+maxIncomeMul
                        if(!minIncomeMul && !maxIncomeMul){
                            incomeMulStr = "Not Available";
                        }else if(minIncomeMul === maxIncomeMul){
                            incomeMulStr = minIncomeMul;
                        }
                        items.boxbudgetratio = incomeMulStr;

                    }

                });
                $scope.talentGridOption.data = data;
                $scope.gridData = data;
                $scope.filteredRows = data;
                $scope.talentCount = data.length;
                $scope.visibleTalent = data.length;
                $('.talent-right-container-content').hide();
                $("span.ui-grid-pager-row-count-label").html(" Records per page   <a href=\"#\" title=\"Click here to edit selected row.\"><span id=\"editLink\" ng-click=\"showPopSection();\" style=\"display:none;\">Edit</span></a>");
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
                            $scope.getTalentData = {};
                            $scope.getTalentData.id = row.entity.id;
                            $('.talent-right-container-content').show();
                            //$scope.showLink = 'show';
                            $("#editLink").show();
                        }
                        if(!row.isSelected){
                            $scope.getTalentData = {};
                            $scope.gridApi.selection.clearSelectedRows();
                            $('.talent-right-container-content').hide();
                            $("#editLink").hide();
                            //$scope.showLink = 'hide';
                        }
                    });
            };

            $scope.setLoading = function(loading) {
                $scope.isLoading = loading;
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
                        if(item.boxbudgetratio !==null && item.boxbudgetratio !=="Not Available"){
                            if(seletedRatio==="maxgreaterorequal"){
                                boxbudgetratio = item['boxbudgetratio'].toString().split('-');
                                var maxRatio = parseFloat(getNumber(boxbudgetratio[boxbudgetratio.length-1])).toFixed(1);
                                //maxRatio = getNumber(maxRatio);
                                //var maxRatio = parseFloat(Math.max.apply(Math, boxbudgetratio)).toFixed(2);
                                if(maxRatio >=inputRatio){
                                    findRatioFlag = true;
                                }

                            }else if(seletedRatio==="mingreaterorequal"){
                                boxbudgetratio = item['boxbudgetratio'].toString().split('-');
                                //var minRatio = parseFloat(boxbudgetratio[0]);
                                var minRatio = parseFloat(getNumber(boxbudgetratio[0])).toFixed(1);
                                if(minRatio >=inputRatio){
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

                    if(item.estimatedBudget !==null && item.estimatedBudget !=="Not Available"){
                        $('div#budget_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            selectedNames = selectedNames.replace(/ /g,'').toLowerCase();
                            var budgets = item['estimatedBudget'].split('-');
                            console.log(budgets);
                            var lowerLimit = budgets[0];
                            var upperLimit = budgets[budgets.length-1];
                            var lowerLimitDigit = getNumber(lowerLimit);
                            var upperLimitDigit = getNumber(upperLimit);
                            var lowerLimitSuffix = lowerLimit.slice(-1).toLowerCase();
                            var upperLimitSuffix = upperLimit.slice(-1).toLowerCase();
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

                    if(item.boxOfficeIncome !==null && item.boxOfficeIncome !=="Not Available"){
                        $('div#box_office_income_list input:checked').each(function () {
                            selectedNames = $(this).val().trim();
                            selectedNames = selectedNames.replace(/ /g,'').toLowerCase();
                            var budgets = item['boxOfficeIncome'].split('-');
                            var lowerLimit = budgets[0];
                            var upperLimit = budgets[budgets.length-1];
                            var lowerLimitDigit = getNumber(lowerLimit);
                            var upperLimitDigit = getNumber(upperLimit);
                            var lowerLimitSuffix = lowerLimit.slice(-1).toLowerCase();
                            var upperLimitSuffix = upperLimit.slice(-1).toLowerCase();
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
                    $scope.mainTalent = (result.details[0]) ? result.details[0]:'';
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
                    creditObj.logline = (value.logline === null) ? 'Not Available' : value.logline;
                    creditObj.budget = (value.estimatedBudget === 0) ? 'Not Available' : '$'+numberFormatter(value.estimatedBudget);
                    creditObj.boxoffice = (value.box_office_income === 0) ? 'Not Available' : '$'+numberFormatter(value.box_office_income);
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
                    var typeArray = [];
                    if(!!result.associateInfo && result.associateInfo.length>0){
                    	angular.forEach(result.associateInfo, function(value, key) {
	                    	associateObj.associatename = value.type;
	                    	associateObj.firstname = value.firstName;
	                    	associateObj.lastname = value.lastName;
                    		associateArray.push(associateObj);
                    		typeArray.push(value.type);
                    		associateObj = {};
                    	});
                    }

            		if($.inArray( "Manager",typeArray) === -1){
            			associateObj.associatename = 'Manager';
                    	associateObj.firstname = '';
                    	associateObj.lastname = '';
                		associateArray.push(associateObj);
                		associateObj = {};
            		}
            		
            		if($.inArray( "Agent",typeArray) === -1){
            			associateObj.associatename = 'Agent';
                    	associateObj.firstname = '';
                    	associateObj.lastname = '';
                		associateArray.push(associateObj);
                		associateObj = {};
            		}
            		
            		if($.inArray( "Attorney",typeArray) === -1){
            			associateObj.associatename = 'Attorney';
                    	associateObj.firstname = '';
                    	associateObj.lastname = '';
                		associateArray.push(associateObj);
                		associateObj = {};
            		}
            		
            		if($.inArray( "Publicist",typeArray) === -1){
            			associateObj.associatename = 'Publicist';
                    	associateObj.firstname = '';
                    	associateObj.lastname = '';
                		associateArray.push(associateObj);
                		associateObj = {};
            		}
                		
                	$scope.associateData = associateArray;
                    
                    
                    $('.right-talent-container-menu-link').removeClass('active-talent-link');
                    $("#infoTab").addClass('active-talent-link');
                    $scope.activeSectionInfo = 'info';
                });
                $('.active-talent').each(function () {
                    $(this).removeClass('active-talent');
                });
            };

            var getTalentAllDetailsById = function(talentId){
                creditFactory.getAllNames()
                .then(function(result) {
                    $scope.data.Credit= {};
                    $scope.data.Credit = result;
                     talentFactory.getTalentAllInfoById(talentId)
                     .then(function (result){
                        $scope.activeElement = result;
                    });
                });
                 talentFactory.getTalentAllInfoById(talentId)
                     .then(function (result){
                        $scope.activeElement = result;
                    });
                // talentFactory.getTalent(talentId, function (result) {
                //     $scope.activeElement = result;
                // });
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
                // $($event.target).parent().slideUp();
                // commentFactory.removeComment(comment_id);
                // $scope.deletedComments++;
                    var r = confirm("Do you really want to delete this comment?");
                    if (r == true) {
                        $($event.target).parent().slideUp();
                        commentFactory.removeComment(comment_id);
                        $scope.deletedComments++;
                    } else {
                    //return false;
                    }

            };
        
           
        var addFetchAssociateName = function(talentid,typeid,associate_id){
            var dataList = [];
            dataList['talent_id'] = talentid;
            dataList['associte_types_id'] = typeid;
            dataList['associate_id'] = associate_id;
            contactFactory.addGetAssociateNamesById(dataList,function(result) {         
                if(result==="Error"){
                    alert("Error:Duplicate associate not allowed");
                    return false;
                }
                for(var i in result){
                    if(result[i].type==="Agent"){
                    $scope.agentModel.AgentName=result[i].name;
                    }
                    if(result[i].type==="Manager"){
                    $scope.agentModel.ManagerName=result[i].name;
                    }
                    if(result[i].type==="Attorney"){
                    $scope.agentModel.AttorneyName=result[i].name;
                    }
                    if(result[i].type==="Publicist"){
                      $scope.agentModel.PublicistName=result[i].name;
                    }
                }
            //$scope.data.ContactInfo = result;
            });
            
        };

        $scope.submitAssociate = function(){
            var getAssociateInfo = JSON.parse($scope.activeElement.associate_obj);
            addFetchAssociateName($scope.activeElement.id,getAssociateInfo.typeid,getAssociateInfo.id);
        };

        $scope.submitTalentCreditData = function() {
          var credits = $('.talent-credit-select').val();
          var role = $('.talent-credit-role-select').val() || null;

          talentFactory.addTalentCreditJoin($scope.activeElement.id, credits, role, function(data) {
            if (data.length !== $scope.activeElement.talentCreditJoins.length) {
              $scope.showmsg.errorText = 'Credit(s) added to ' + $scope.activeElement.first_name + ' ' + $scope.activeElement.last_name;
              $scope.activeElement.talentCreditJoins = data;
            } else {
              $scope.showmsg.errorText = 'Credit(s) already exists';
            }
          });
        };

         $scope.removeTalentCreditJoin = function($event, join_id) {
          talentFactory.removeTalentCreditJoin(join_id, function(data) {
            $($event.target).parent().slideUp();
            $($event.target).parent().remove();
            $scope.showmsg.errorText = 'Credit removed from ' + $scope.activeElement.first_name + ' ' + $scope.activeElement.last_name;
            $scope.activeElement.talentCreditJoins = data;
          });
        };


        // Submit comment
        $scope.submitComment = function() {
          // If text is in the textarea, submit the new comment
          if ($('.data-entry-comment-input').val() !== "") {
            commentFactory.addComment($('.data-entry-comment-input').val(), $scope.activeElement.id, function(result) {
              $scope.activeElement.comments.unshift(result);
              //Once comment is added, append it to the comments-container and clear the textarea
              $('.data-entry-comment-input').val('');
            });
          }
        };


             // Remove comment when delete button is clicked
            $scope.removeComment = function($event, comment_id) {
            var r = confirm("Do you really want to delete this comment?");
                if (r == true) {
                    $($event.target).parent().slideUp();
                  commentFactory.removeComment(comment_id);
                } else {
                    //return false;
                }
            };

            $scope.submitData = function() {
              dataSubmitter[$scope.section]();
            };
            $scope.closepopup = function(){
                $scope.activeElement = {};
                $(".hiddenPopUp").hide();
                 $("#cover").hide();
            };
            var checkInputs = function(section) {
                  var result = true;
                  if (!section) {
                    $('input:visible, select:visible').each(function() {
                      if ($(this).attr('required')) {
                        if ($(this).val() === null || $(this).val().length === 0) {
                          result = false;
                        }
                      }
                    });
                  } else {
                    $('.talent-form').find('input, visible').each(function() {
                      if ($(this).attr('required')) {
                        if ($(this).val() === null || $(this).val().length === 0) {
                          result = false;
                        }
                      }
                    });
                  }
                  
                  return result;
            };

            // Updates visible talent count on th upper left
            var updateVisibleCount = function () {
                setTimeout(function () {
                    $scope.visibleTalent = $('.talent-table-row').length;
                    $scope.$apply();
                }, 100);

            };

            // $scope.closepopup = function(){
            //     $s
            // };

            // $scope.showPopSection = function(){
            //     alert('hiiiiiiiii');
            //     $scope.showPopUp = 'Show';
            // };
            // JQuery

            // Expand/collapse checkbox containers
            $(document).on('click', '.filter-header-container', function () {
                if ($(this).next('.filter-option-container').is(':visible')) {
                    $(this).next('.filter-option-container').hide();
                    $(this).find('.arrow').removeClass( "arrow-down" );
                    $(this).find('.arrow').addClass( "arrow-right" );

                } else {
                    $(this).next('.filter-option-container').show();
                    //$(this).find('.arrow').removeClass( "arrow-right" );
                    $(this).find('.arrow').addClass( "arrow-down" );
                }
                // $(this).next('.filter-option-container').slideToggle();
                

                $('.talent-left-col-container').hide();
                $('.talent-left-col-container').show();
            });

            $(document).on('click', '#editLink', function () {
                //getTalentAllDetailsById($scope.getTalentData.id);
                //addFetchAssociateName($scope.getTalentData.id,-1,-1);
                $scope.setLoading(true);
                 talentFactory.getTalentAllInfoById($scope.getTalentData.id)
                     .then(function (result){
                        $scope.activeElement = result.data;
                        $scope.showmsg= {};
                        $scope.agentModel = {};
                        $scope.section = 'Talent';
                        $scope.talentSection = 'main';
                         creditFactory.getAllNames()
                        .then(function(result) {
                            $scope.data.Credit= {};
                            $scope.data.Credit = result.data;
                            $scope.setLoading(false);
                            $("#cover").show();
                            $(".hiddenPopUp").show();                        
                            $('.talent-form-menu-button-active').removeClass('talent-form-menu-button-active');
                            $("#mainTab").addClass('talent-form-menu-button-active');                         
                        });
                    });
               
                });



        });
})();