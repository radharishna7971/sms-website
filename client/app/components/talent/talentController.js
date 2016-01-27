(function () {
    'use strict';
    angular.module('talentController', ['talentFactory', 'contactFactory', 'roleFactory', 'genreFactory', 'commentFactory', 'talentGridFactory', 'ethnicityFactory'])
        .controller('talentController', function ($rootScope, $scope, $q, $compile, $timeout, talentFactory, contactFactory, creditFactory, roleFactory, genreFactory, commentFactory, talentGridFactory, ethnicityFactory, localStorageService) {

            ///////////////////////////////
            /// Initialize View
            ///////////////////////////////


            if (!!window.localStorage.smstudiosLoginUserName) {
                $scope.talent_display_username = window.localStorage.smstudiosLoginUserName;
            }
            $('.filter-header-container').find('.arrow').removeClass("arrow-down");
            $('.filter-header-container').find('.arrow').addClass("arrow-right");
            $scope.incomeMultiple = [{
                "id": 1,
                "name": 1
            }, {
                "id": 2,
                "name": 2
            }, {
                "id": 3,
                "name": 3
            }, {
                "id": 4,
                "name": 4
            }, {
                "id": 5,
                "name": 5
            }];
            $scope.budgets = [{
                "id": 1,
                "name": "Under $250K"
            }, {
                "id": 2,
                "name": "$250K-$1M"
            }, {
                "id": 3,
                "name": "$1M-$5M"
            }, {
                "id": 4,
                "name": "$5M-$10M"
            }, {
                "id": 5,
                "name": "$10M-$50M"
            }, {
                "id": 6,
                "name": "$50M-$100M"
            }, {
                "id": 7,
                "name": "Above $100M"
            }];
            $scope.boxofficerev = [{
                "id": 1,
                "name": "Under $250K"
            }, {
                "id": 2,
                "name": "$250K-$1M"
            }, {
                "id": 3,
                "name": "$1M-$5M"
            }, {
                "id": 4,
                "name": "$5M-$10M"
            }, {
                "id": 5,
                "name": "$10M-$50M"
            }, {
                "id": 6,
                "name": "$50M-$100M"
            }, {
                "id": 7,
                "name": "Above $100M"
            }];
            $scope.ages = [{
                "id": 1,
                "name": "Less than 20"
            }, {
                "id": 2,
                "name": "20-30"
            }, {
                "id": 3,
                "name": "30-40"
            }, {
                "id": 4,
                "name": "40-50"
            }, {
                "id": 5,
                "name": "over 50"
            }];

            $scope.term = "";
            $scope.successmsgtalent = false;
            var filereName = $scope.term;
            $scope.talentGridOption = {};
            $scope.activeSectionInfo = false;
            $scope.filerByname = "";
            var Rolls = [];
            var Genres = [];
            $scope.showmsg = {};
            $scope.showPopUp = false;
            $scope.getTalentData = {};
            $scope.talentModel = {};

            var checkAllRole = localStorageService.get("allRole");
            if (checkAllRole && checkAllRole === 'unchecked') {
                $scope.allRoleChecked = false;
            } else {
                $scope.allRoleChecked = true;
            }

            var checkAllGenre = localStorageService.get("allGenre");
            if (checkAllGenre && checkAllGenre === 'unchecked') {
                $scope.allGenreChecked = false;
            } else {
                $scope.allGenreChecked = true;
            }

            var checkAllGender = localStorageService.get("allGender");
            if (checkAllGender && checkAllGender === 'unchecked') {
                $scope.allGenderChecked = false;
            } else {
                $scope.allGenderChecked = true;
            }

            var checkAllAge = localStorageService.get("allAge");
            if (checkAllAge && checkAllAge === 'unchecked') {
                $scope.allAgeChecked = false;
            } else {
                $scope.allAgeChecked = true;
            }

            var checkAllEthnicity = localStorageService.get("allEthnicity");
            if (checkAllEthnicity && checkAllEthnicity === 'unchecked') {
                $scope.allEthnicityChecked = false;
            } else {
                $scope.allEthnicityChecked = true;
            }

            var checkAllCountry = localStorageService.get("allCountry");
            if (checkAllCountry && checkAllCountry === 'unchecked') {
                $scope.allCountryChecked = false;
            } else {
                $scope.allCountryChecked = true;
            }

            var checkAllCreatedBy = localStorageService.get("allCreatedBy");
            if (checkAllCreatedBy && checkAllCreatedBy === 'unchecked') {
                $scope.allCreatedByChecked = false;
            } else {
                $scope.allCreatedByChecked = true;
            }

            var checkAllAward = localStorageService.get("allAward");
            if (checkAllAward && checkAllAward === 'unchecked') {
                $scope.allAwardsChecked = false;
            } else {
                $scope.allAwardsChecked = true;
            }

            var checkAllBudget = localStorageService.get("allBudget");
            if (checkAllBudget && checkAllBudget === 'unchecked') {
                $scope.allBudgetChecked = false;
            } else {
                $scope.allBudgetChecked = true;
            }

            var checkAllallBoxOfficeRev = localStorageService.get("allBoxOfficeRev");
            if (checkAllallBoxOfficeRev && checkAllallBoxOfficeRev === 'unchecked') {
                $scope.allBoxOfficeRevChecked = false;
            } else {
                $scope.allBoxOfficeRevChecked = true;
            }
            var paginationOptions = {
                pageNumber: 1,
                pageSize: 100,
                sort: null
            };
            var arrayLenths = 0;
            var isIncomeBudgetRatioEnabled = 0;
            var filerDataInputs = {};
            filerDataInputs.gender = [];
            filerDataInputs.nameVal = [];
            filerDataInputs.role = [];
            filerDataInputs.genres = [];
            filerDataInputs.age = [];
            filerDataInputs.country = [];
            filerDataInputs.createdby = [];
            filerDataInputs.EthnicityID = [];
            filerDataInputs.budgetsValues = [];
            filerDataInputs.incomeValues = [];
            filerDataInputs.awardsList = [];

            $scope.addAgentRow = {};
            $scope.isAgentTypeDisabled = false;
            $scope.isCmpnyDisabled = true;
            $scope.isNameDisabled = true;
            $scope.addAgentPanel = true;
            $scope.updateAgentPanel = false;
            $scope.agentNameByType = [];
            // This contains functions for submitting data to the database
            var dataSubmitter = {
                Talent: function () {
                    if (!checkInputs('talent')) {
                        $scope.showmsg.errorText = 'Please fill all required fields in correct format';
                    } else {
                        if(($scope.activeElement.first_name=="" && $scope.activeElement.last_name =="") || ($scope.activeElement.first_name==null && $scope.activeElement.last_name ==null)){
                            $scope.showmsg.errorText = 'Please fill either firstname or lastname';
                            return false;
                        }
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
                        //Formatted url
                        $scope.activeElement.twitter_url = $scope.activeElement.twitter_url === null ? $scope.activeElement.twitter_url : ($scope.activeElement.twitter_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');
                        $scope.activeElement.facebook_url = $scope.activeElement.facebook_url === null ? $scope.activeElement.facebook_url : ($scope.activeElement.facebook_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');
                        $scope.activeElement.youtube_url = $scope.activeElement.youtube_url === null ? $scope.activeElement.youtube_url : ($scope.activeElement.youtube_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');
                        $scope.activeElement.vine_url = $scope.activeElement.vine_url === null ? $scope.activeElement.vine_url : ($scope.activeElement.vine_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');
                        $scope.activeElement.instagram_url = $scope.activeElement.instagram_url === null ? $scope.activeElement.instagram_url : ($scope.activeElement.instagram_url).replace("https://www.", '').replace("http://www.", '').replace("http://", '').replace("https://", '').replace("www.", '');

                        if (angular.isUndefined($scope.activeElement.partner)) {
                            $scope.activeElement.partner = $scope.inputPartner;
                        } else if ($scope.activeElement.partner !== null) {
                            $scope.activeElement.partner = $scope.activeElement.partner.name;
                        }
                        talentFactory.addOrEdit($scope.activeElement, function (res) {
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
            $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };
            var checkRowId = "";
            $scope.showInfo = function (event, row) {
                $scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
                angular.forEach($scope.filteredRows, function(items){
                    items.isrowSelectionChangedOnclcik = false;
                });
                var clickedRowId = parseInt(row.entity.id);
                if (parseInt(checkRowId) === clickedRowId && $("#editLink").is(':visible')) {
                    $('.talent-right-container-content').hide();
                    $("#editLink").hide();
                    //$("#exportLink").hide();
                    row.isrowSelectionChangedOnclcik = false;
                    return false;
                } else {
                    row.isrowSelectionChangedOnclcik = true;
                    updateMainTalent(row.entity.id, row.entity);
                    $scope.getTalentData = {};
                    $scope.getTalentData.id = row.entity.id;
                    $('.talent-right-container-content').show();
                    $("#editLink").show();
                    //$("#exportLink").show();            
                    checkRowId = row.entity.id;
                    return false;
                }

            };


            $scope.gridData = [];
            $scope.talentGridOption = talentGridFactory.getGridOptions();
            $scope.talentGridOption.appScopeProvider = $scope.myAppScopeProvider;
            $scope.section = 'Talent';
            $scope.talentSection = 'main';
            $scope.showPopUp = '';

            function validateEmail(email) {
                var re = /\S+@\S+\.\S+/;
                return re.test(email);
            }

            $scope.showsection = function ($event, sectioname) {
                $scope.successmsgtalent = false;
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

            function getNumber(inputStr) {
                var numberValue = Number(inputStr.replace(/[^0-9\.]+/g, ""));
                return parseInt(numberValue);
            }

            contactFactory.getAssociateNames(function (result) {
                $scope.data.Contact = result;
            });

            function removeElement(arrayName, arrayElement) {
                for (var i = 0; i < arrayName.length; i++) {
                    if (arrayName[i] == arrayElement)
                        arrayName.splice(i, 1);
                }
            }
            var taletDataLenght = function () {
                talentFactory.getTalentRowCount(function (data) {
                    if (!arrayLenths){
                        $scope.talentGridOption.totalItems = data[0].rowCount;
                    }
                    $scope.talentCount = data[0].rowCount;
                    $scope.visibleTalent = data[0].rowCount;
                });
            };


            var bindTalentData = function () {
                if (arrayLenths) {
                    $scope.setLoading(true);
                }
                talentFactory.getAll(paginationOptions.pageNumber, paginationOptions.pageSize, filerDataInputs, arrayLenths, function (data) {
                    $scope.setLoading(false);
                    angular.forEach(data, function (items) {
                    	if(items.name !== '' && items.name !== null){
                        if (items.age == 0) {
                            items.age = "";
                        }
                        if (items.estimatedBudget !== null && items.estimatedBudget) {
                            var estimatedBudgets = items.estimatedBudget.split(',');
                            removeElement(estimatedBudgets, 0);
                            removeElement(estimatedBudgets, 0.0);
                            var maxBudget = Math.max.apply(Math, estimatedBudgets);
                            var maxBudgetInformatted = numberFormatter(parseInt(maxBudget));
                            var minBudget = Math.min.apply(Math, estimatedBudgets);
                            var minBudgetInformatted = numberFormatter(parseInt(minBudget));
                            var estimatedBudgetVal = '$' + minBudgetInformatted + '-' + '$' + maxBudgetInformatted
                            if (!parseInt(minBudget) && !parseInt(maxBudget)) {
                                estimatedBudgetVal = "Not Available";
                            } else if (parseInt(minBudget) === parseInt(maxBudget)) {
                                estimatedBudgetVal = '$' + minBudgetInformatted;
                            } else if (!parseInt(minBudget) && parseInt(maxBudget)) {
                                estimatedBudgetVal = '$' + maxBudgetInformatted;
                            }
                            items.estimatedBudget = estimatedBudgetVal;
                        }
                        if (items.boxOfficeIncome !== null && items.boxOfficeIncome) {
                            var boxOfficeIncomes = items.boxOfficeIncome.split(',');
                            removeElement(boxOfficeIncomes, 0);
                            removeElement(boxOfficeIncomes, 0.0);
                            var maxIncome = Math.max.apply(Math, boxOfficeIncomes);
                            var maxIncomeInformatted = numberFormatter(parseInt(maxIncome));
                            var minIncome = Math.min.apply(Math, boxOfficeIncomes);
                            var minIncomeInformatted = numberFormatter(parseInt(minIncome));
                            var boxOfficeIncome = '$' + minIncomeInformatted + '-' + '$' + maxIncomeInformatted;
                            if (!parseInt(minIncome) && !parseInt(maxIncome)) {
                                boxOfficeIncome = "Not Available";
                            } else if (parseInt(minIncome) === parseInt(maxIncome)) {
                                boxOfficeIncome = '$' + minIncomeInformatted;
                            } else if (!parseInt(minIncome) && parseInt(maxIncome)) {
                                boxOfficeIncome = '$' + maxIncomeInformatted;
                            }
                            items.boxOfficeIncome = boxOfficeIncome;
                        }
                        if (items.boxbudgetratio === "0.0") {
                            items.boxbudgetratio = "Not Available";
                        }
                        if (items.boxbudgetratio !== null && items.boxbudgetratio) {
                            var incomeMultiple = items.boxbudgetratio.split(',');
                            removeElement(incomeMultiple, 0);
                            removeElement(incomeMultiple, 0.0);
                            var maxIncomeMul = Math.max.apply(Math, incomeMultiple);
                            //maxIncomeMul = numberFormatter(parseInt(maxIncomeMul));
                            var minIncomeMul = Math.min.apply(Math, incomeMultiple);
                            //minIncomeMul = numberFormatter(parseInt(minIncomeMul));
                            var incomeMulStr = minIncomeMul + '-' + maxIncomeMul
                            if (!minIncomeMul && !maxIncomeMul) {
                                incomeMulStr = "Not Available";
                            } else if (minIncomeMul === maxIncomeMul) {
                                incomeMulStr = minIncomeMul;
                            } else if (!minIncomeMul && maxIncomeMul) {
                                incomeMulStr = maxIncomeMul;
                            }
                            items.boxbudgetratio = incomeMulStr;

                        }
                    	}
                    });
                    //alert(arrayLenths);

                    if (arrayLenths) {
                         //taletDataLenght();
                         $scope.talentGridOption.totalItems = data.length;
                        $scope.visibleTalent = data.length;

                        if (data.length > 100) {
                            $scope.talentGridOption.useExternalPagination = false;
                        }
                    } else {
                        taletDataLenght();
                        $scope.talentGridOption.useExternalPagination = true;
                    }
                    $scope.gridData = data;
                    //alert('hii' + isIncomeBudgetRatioEnabled);
                    if (isIncomeBudgetRatioEnabled) {
                        $scope.talentGridOption.data = _.filter($scope.gridData, function (item) {
                            var isValidOptionRatio = ($scope.budgetMultipleOption !== null) && !(angular.isUndefined($scope.budgetMultipleOption)) && ($scope.budgetMultipleOption !== "");
                            var isValidRatio = ($scope.incomeMultipleInput !== null) && !(angular.isUndefined($scope.incomeMultipleInput)) && !isNaN($scope.incomeMultipleInput) && ($scope.incomeMultipleInput !== "");

                            var findBudgetFlag = false;
                            var findBoxOfficeIncomeFlag = false;
                            var findAwardsFlag = false;
                            var findRatioFlag = false;
                            var selectedNames = '';
                            if (item.estimatedBudget !== null && item.estimatedBudget !== "Not Available") {
                                $('div#budget_list div input:checked').each(function () {
                                    selectedNames = $(this).val().trim();
                                    //.log(selectedNames);
                                    selectedNames = selectedNames.replace(/ /g, '').toLowerCase();
                                    var budgets = item['estimatedBudget'].split('-');
                                    var lowerLimit = budgets[0];
                                    var upperLimit = budgets[budgets.length - 1];
                                    var lowerLimitDigit = getNumber(lowerLimit);
                                    var upperLimitDigit = getNumber(upperLimit);
                                    var lowerLimitSuffix = lowerLimit.slice(-1).toLowerCase();
                                    var upperLimitSuffix = upperLimit.slice(-1).toLowerCase();
                                    if (selectedNames === "under$250k" && (upperLimitSuffix === "k" || upperLimitSuffix === "0")) {
                                        if (upperLimitDigit < 250) {
                                            findBudgetFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$250k-$1m" && lowerLimitSuffix === "k" && upperLimitSuffix === "k") {
                                        if (lowerLimitDigit >= 250 && upperLimitDigit <= 999999) {
                                            findBudgetFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$1m-$5m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (lowerLimitDigit >= 1 && upperLimitDigit < 5) {
                                            findBudgetFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$5m-$10m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (lowerLimitDigit >= 5 && upperLimitDigit < 10) {
                                            findBudgetFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$10m-$50m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (lowerLimitDigit >= 10 && upperLimitDigit < 50) {
                                            findBudgetFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$50m-$100m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (lowerLimitDigit >= 50 && upperLimitDigit < 100) {
                                            findBudgetFlag = true;
                                        }
                                    }
                                    if (selectedNames === "above$100m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (upperLimitDigit >= 100) {
                                            findBudgetFlag = true;
                                        }
                                    }

                                });
                            }
                            if (item.boxOfficeIncome !== null && item.boxOfficeIncome !== "Not Available") {
                                $('div#box_office_income_list div input.BoxOfficeIncome-list-class:checked').each(function () {
                                    selectedNames = $(this).val().trim();
                                    selectedNames = selectedNames.replace(/ /g, '').toLowerCase();
                                    //console.log(selectedNames);
                                    var budgets = item['boxOfficeIncome'].split('-');
                                    var lowerLimit = budgets[0];
                                    var upperLimit = budgets[budgets.length - 1];
                                    var lowerLimitDigit = getNumber(lowerLimit);
                                    var upperLimitDigit = getNumber(upperLimit);
                                    var lowerLimitSuffix = lowerLimit.slice(-1).toLowerCase();
                                    var upperLimitSuffix = upperLimit.slice(-1).toLowerCase();
                                    if (selectedNames === "under$250k" && (upperLimitSuffix === "k" || upperLimitSuffix === "0")) {
                                        if (upperLimitDigit < 250) {
                                            findBoxOfficeIncomeFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$250k-$1m" && lowerLimitSuffix === "k" && upperLimitSuffix === "k") {
                                        if (lowerLimitDigit >= 250 && upperLimitDigit <= 999999) {
                                            findBoxOfficeIncomeFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$1m-$5m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (lowerLimitDigit >= 1 && upperLimitDigit < 5) {
                                            findBoxOfficeIncomeFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$5m-$10m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (lowerLimitDigit >= 5 && upperLimitDigit < 10) {
                                            findBoxOfficeIncomeFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$10m-$50m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (lowerLimitDigit >= 10 && upperLimitDigit < 50) {
                                            findBoxOfficeIncomeFlag = true;
                                        }
                                    }
                                    if (selectedNames === "$50m-$100m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (lowerLimitDigit >= 50 && upperLimitDigit < 100) {
                                            findBoxOfficeIncomeFlag = true;
                                        }
                                    }
                                    if (selectedNames === "above$100m" && lowerLimitSuffix === "m" && upperLimitSuffix === "m") {
                                        if (upperLimitDigit >= 100) {
                                            findBoxOfficeIncomeFlag = true;
                                        }
                                    }

                                });
                            }
                            if (item.awards !== null) {
                                $('div#awards_list input:checked').each(function () {
                                    selectedNames = $(this).val().trim();
                                    if ((item['awards'].toLowerCase()).indexOf(selectedNames.toLowerCase()) !== -1) {
                                        findAwardsFlag = true;
                                    }
                                });
                            }
                            if (isValidRatio && isValidOptionRatio) {
                                //selectedNames = $scope.filerByname;
                                var inputRatio = parseFloat($scope.incomeMultipleInput).toFixed(1);
                                var seletedRatio = ($scope.budgetMultipleOption).toLowerCase();
                                var boxbudgetratio = "";
                                if (item.boxbudgetratio !== null && item.boxbudgetratio !== "Not Available") {
                                    if (seletedRatio === "maxgreaterorequal") {
                                        boxbudgetratio = item['boxbudgetratio'].toString().split('-');
                                        var maxRatio = parseFloat(getNumber(boxbudgetratio[boxbudgetratio.length - 1])).toFixed(1);
                                        //maxRatio = getNumber(maxRatio);
                                        //var maxRatio = parseFloat(Math.max.apply(Math, boxbudgetratio)).toFixed(2);
                                        if (maxRatio >= inputRatio) {
                                            findRatioFlag = true;
                                        }

                                    } else if (seletedRatio === "mingreaterorequal") {
                                        boxbudgetratio = item['boxbudgetratio'].toString().split('-');
                                        //var minRatio = parseFloat(boxbudgetratio[0]);
                                        var minRatio = parseFloat(getNumber(boxbudgetratio[0])).toFixed(1);
                                        if (minRatio >= inputRatio) {
                                            findRatioFlag = true;
                                        }

                                    }
                                }
                            }
                            if ($("input#allBudget").is(':checked')) {
                                findBudgetFlag = true;
                            }
                            if ($("input#allBoxRevenue").is(':checked')) {
                                findBoxOfficeIncomeFlag = true;
                            }
                            if ($("input#allAwards").is(':checked')) {
                                findAwardsFlag = true;
                            }
                            if (!isValidRatio || !isValidOptionRatio) {
                                findRatioFlag = true;
                            }
                            if (findBudgetFlag && findBoxOfficeIncomeFlag && findAwardsFlag && findRatioFlag) {
                                return true;
                            } else {
                                return false;
                            }

                        });
                        $scope.talentGridOption.totalItems = $scope.talentGridOption.data.length;
                    } else {
                        $scope.talentGridOption.data = data;
                    }
                    
                    $scope.filteredRows = $scope.talentGridOption.data;

                    $('.talent-right-container-content').hide();
                    $("span.ui-grid-pager-row-count-label").html(" Records per page <button id='exportLink' ng-click='getSelectRow()' class='btn btn-primary btn-xs'>Export</button> <button id='editLink' style='display:none' class='btn btn-primary btn-xs'>Edit</button>");
                });
            };
             var filterAll = function () {
                arrayLenths = 0;
                isIncomeBudgetRatioEnabled = 0;
                filerDataInputs.gender.length = 0;
                filerDataInputs.nameVal.length = 0;
                filerDataInputs.role.length = 0;
                filerDataInputs.genres.length = 0;
                filerDataInputs.awardsList.length = 0;
                filerDataInputs.age.length = 0;
                filerDataInputs.country.length = 0;
                filerDataInputs.createdby.length = 0;
                filerDataInputs.EthnicityID.length = 0;
                filerDataInputs.budgetsValues.length = 0;
                filerDataInputs.incomeValues.length = 0;
                var isValidOptionRatios = ($scope.budgetMultipleOption !== null) && !(angular.isUndefined($scope.budgetMultipleOption)) && ($scope.budgetMultipleOption !== "");
                var isValidRatios = ($scope.incomeMultipleInput !== null) && !(angular.isUndefined($scope.incomeMultipleInput)) && !isNaN($scope.incomeMultipleInput) && ($scope.incomeMultipleInput !== "");


                if ($scope.filerByname !== '' && $scope.filerByname != null && !angular.isUndefined($scope.filerByname)) {
                    filerDataInputs.nameVal.push($scope.filerByname);
                    arrayLenths = 1;
                }
                var checkValues = $('div.filter-option-container input[type=checkbox]:checked').map(function () {
                    if ($(this).hasClass('gender-input')) {
                        filerDataInputs.gender.push($(this).val());
                        arrayLenths = 1;
                    }
                    if ($(this).hasClass('role-list-class')) {
                        filerDataInputs.role.push($(this).val());
                        arrayLenths = 1;
                    }
                    if ($(this).hasClass('genre-list-class')) {
                        filerDataInputs.genres.push($(this).val());
                        arrayLenths = 1;
                    }

                    if ($(this).hasClass('age-list-class')) {
                        filerDataInputs.age.push($(this).val());
                        arrayLenths = 1;
                    }
                    if ($(this).hasClass('country-list-class')) {
                        filerDataInputs.country.push($(this).val());
                        arrayLenths = 1;
                    }
                    if ($(this).hasClass('createdby-list-class')) {
                        filerDataInputs.createdby.push($(this).val());
                        arrayLenths = 1;
                    }
                    if ($(this).hasClass('ethnicity-list-class')) {
                        filerDataInputs.EthnicityID.push($(this).val());
                        arrayLenths = 1;
                    }
                    if ($(this).hasClass('budget-list-class')) {
                        filerDataInputs.budgetsValues.push($(this).val());
                        arrayLenths = 1;
                        isIncomeBudgetRatioEnabled = 1;
                        //alert(isIncomeBudgetRatioEnabled);
                    }
                    if ($(this).hasClass('BoxOfficeIncome-list-class')) {
                        filerDataInputs.incomeValues.push($(this).val());
                        arrayLenths = 1;
                        isIncomeBudgetRatioEnabled = 1;
                        //alert(isIncomeBudgetRatioEnabled);
                    }
                    if ($(this).hasClass('awards-list-class')) {
                        filerDataInputs.awardsList.push($(this).val());
                        arrayLenths = 1;
                        isIncomeBudgetRatioEnabled = 1;
                    }
                    if (isValidOptionRatios && isValidRatios) {
                        arrayLenths = 1;
                        isIncomeBudgetRatioEnabled = 1;
                    }
                    taletDataLenght();
                }).get();
                bindTalentData();
            };

            $timeout(function() {
                filterAll();
            }, 500);
            function saveState() {
                var state = $scope.gridApi.saveState.save();
                localStorageService.set('gridState', state);
            }

            function restoreState() {
                $timeout(function () {
                    var state = localStorageService.get('gridState');
                    if (state) $scope.gridApi.saveState.restore($scope, state);
                });
            }

            $scope.mainTalent = false;
            $scope.activeSection = 'info';
            $scope.filterColumn = 'last_name';
            $scope.deletedComments = 0;
            $scope.talentGridOption.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNumber = newPage;
                    paginationOptions.pageSize = pageSize;
                    bindTalentData();
                });
                $scope.gridApi.colMovable.on.columnPositionChanged($scope, saveState);
                $scope.gridApi.colResizable.on.columnSizeChanged($scope, saveState);
                $scope.gridApi.core.on.columnVisibilityChanged($scope, saveState);
                $scope.gridApi.core.on.filterChanged($scope, saveState);
                $scope.gridApi.core.on.sortChanged($scope, saveState);
                restoreState();
            };
            $scope.getTalentNames = function (val) {
                var talentNames = [];
                return talentFactory.getNames(val, angular.noop).then(function (result) {
                    return result.data;
                });
            };

            $scope.getTalentDetails = function (itemval) {
                //console.log("selected items.......!!");
                //console.log(itemval);
            };

            $scope.updateTalentPartner = function (itemval) {
                $scope.setLoading(true);
                talentFactory.updateTalentPartnerName($scope.getTalentData.id, itemval.name, function (talentData) {
                    $scope.setLoading(false);
                });
            };

            $scope.setLoading = function (loading) {
                $scope.isLoading = loading;
            };
            $scope.applyAllFilter = function () {
                filterAll();
            };
            
            $scope.updateFiltersByChckBox = function ($event) {
                if (!angular.isUndefined($event)) {
                    if ($($event.target).hasClass("role-list-class")) {
                        $("input#allRole").prop("checked", false);
                    }
                    if ($($event.target).hasClass("genre-list-class")) {
                        $("input#allGenres").prop("checked", false);
                    }
                    if ($($event.target).hasClass("gender-input")) {
                        $("input#allGender").prop("checked", false);
                    }
                    if ($($event.target).hasClass("age-list-class")) {
                        $("input#allAges").prop("checked", false);
                    }
                    if ($($event.target).hasClass("budget-list-class")) {
                        $("input#allBudget").prop("checked", false);
                    }
                    if ($($event.target).hasClass("BoxOfficeIncome-list-class")) {
                        $("input#allBoxRevenue").prop("checked", false);
                    }
                    if ($($event.target).hasClass("BoxOfficeIncome-list-class")) {
                        $("input#allBoxRevenue").prop("checked", false);
                    }
                    if ($($event.target).hasClass("ethnicity-list-class")) {
                        $("input#allEthnicity").prop("checked", false);
                    }
                    if ($($event.target).hasClass("createdby-list-class")) {
                        $("input#allCreatedBy").prop("checked", false);
                    }
                    if ($($event.target).hasClass("country-list-class")) {
                        $("input#allCountries").prop("checked", false);
                    }
                    if ($($event.target).hasClass("awards-list-class")) {
                        $("input#allAwards").prop("checked", false);
                    }

                    if ($event.target.id === "allRole" && $event.target.checked) {
                        $('div#role_list input').each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allRole").prop("checked", true);
                    }
                    if ($event.target.id === "allGenres" && $event.target.checked) {
                        $('div#genre_list input').not(this).each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allGenres").prop("checked", true);
                    }
                    if ($event.target.id === "allGender" && $event.target.checked) {

                        $('div#gender_list input').each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allGender").prop("checked", true);
                    }
                    if ($event.target.id === "allAges" && $event.target.checked) {

                        $('div#age_list input').each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allAges").prop("checked", true);
                    }
                    if ($event.target.id === "allAwards" && $event.target.checked) {

                        $('div#awards_list input').each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allAwards").prop("checked", true);
                    }
                    if ($event.target.id === "allCountries" && $event.target.checked) {

                        $('div#country_list input').each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allCountries").prop("checked", true);
                    }
                    if ($event.target.id === "allBudget" && $event.target.checked) {
                        $('div#budget_list input').each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allBudget").prop("checked", true);
                    }
                    if ($event.target.id === "allBoxRevenue" && $event.target.checked) {
                        $('div#box_office_income_list input').each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allBoxRevenue").prop("checked", true);
                    }
                    if ($event.target.id === "allEthnicity" && $event.target.checked) {
                        $('div#ethnicity_list input').each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allEthnicity").prop("checked", true);
                    }
                    if ($event.target.id === "allCreatedBy" && $event.target.checked) {
                        $('div#createdby_list input').each(function () {
                            $(this).prop("checked", false);
                        });
                        $("input#allCreatedBy").prop("checked", true);
                    }
                }

                $('div#role_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("role-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allRole", "unchecked");
                        }
                        localStorageService.set("role-" + $(this).val().trim(), "");
                    }
                });

                $('div#genre_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("genre-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allGenre", "unchecked");
                        }
                        localStorageService.set("genre-" + $(this).val().trim(), "");
                    }
                });

                $('div#gender_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("gender-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allGender", "unchecked");
                        }
                        localStorageService.set("gender-" + $(this).val().trim(), "");
                    }
                });

                $('div#age_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("age-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allAge", "unchecked");
                        }
                        localStorageService.set("age-" + $(this).val().trim(), "");
                    }
                });

                $('div#ethnicity_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("ethnicity-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allEthnicity", "unchecked");
                        }
                        localStorageService.set("ethnicity-" + $(this).val().trim(), "");
                    }
                });

                $('div#country_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("country-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allCountry", "unchecked");
                        }
                        localStorageService.set("country-" + $(this).val().trim(), "");
                    }
                });

                $('div#createdby_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("createdby-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allCreatedBy", "unchecked");
                        }
                        localStorageService.set("createdby-" + $(this).val().trim(), "");
                    }
                });

                $('div#awards_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("award-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allAward", "unchecked");
                        }
                        localStorageService.set("award-" + $(this).val().trim(), "");
                    }
                });

                $('div#budget_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("budget-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allBudget", "unchecked");
                        }
                        localStorageService.set("budget-" + $(this).val().trim(), "");
                    }
                });

                $('div#box_office_income_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("boxofficerev-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allBoxOfficeRev", "unchecked");
                        }
                        localStorageService.set("boxofficerev-" + $(this).val().trim(), "");
                    }
                });

               
            };
            var updateMainTalent = function (talentId, talentDetailsInfo) {
                $scope.deletedComments = 0;
                $scope.talentModel = {};
                $scope.partnerData = false;
                talentFactory.talentProfile(talentId, function (result) {
                    $scope.talentModel = {};
                    $scope.partnerData = false;
                    $scope.TalentNameData = (talentDetailsInfo.name) ? ((talentDetailsInfo.name.split(",")).reverse()).join("  ") : '';
                    $scope.talentDetailsInfoData = talentDetailsInfo;

                    $scope.mainTalent = (result.details[0]) ? result.details[0] : '';
                    $scope.id = (result.details[0].id) ? result.details[0].id : '';

                    $scope.partner_id = (result.details[0].partner) ? result.details[0].partner : '';
                    $scope.partner_name = (result.details[0].partnername) ? result.details[0].partnername : '';
                    if (result.details[0].partner !== null && result.details[0].partner !== '') {
                        $scope.partnerData = true;
                        $scope.talentModel.partner = result.details[0].partner;

                    }

                    var phoneNumber = (result.details[0].phone) ? result.details[0].phone : '';
                    if (phoneNumber !== null) {
                        var formattedNo = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                    } else {
                        var formattedNo = '';
                    }
                    $scope.phone = formattedNo;
                    $scope.email = (result.details[0].email) ? result.details[0].email : '';

                    $scope.facebookurl = (result.details[0].facebookurl) ? 'http://www.' + result.details[0].facebookurl : '';
                    $scope.instagramurl = (result.details[0].instagramurl) ? 'http://www.' + result.details[0].instagramurl : '';
                    $scope.twitterurl = (result.details[0].twitterurl) ? 'http://www.' + result.details[0].twitterurl : '';
                    $scope.vineurl = (result.details[0].vineurl) ? 'http://www.' + result.details[0].vineurl : '';
                    $scope.youtubeurl = (result.details[0].youtubeurl) ? 'http://www.' + result.details[0].youtubeurl : '';

                    $scope.creditsData = [];
                    var creditObj = {};
                    var creditArray = [];

                    if (!!result.credits && result.credits.length > 0) {
                        angular.forEach(result.credits, function (value, key) {
                            creditObj.title = (value.creditname === null) ? 'Not Available' : value.creditname;
                            creditObj.releasedate = (value.release_date === null) ? 'Not Available' : value.release_date;
                            creditObj.roll = (value.rolename === null) ? 'Not Available' : value.rolename;
                            creditObj.logline = (value.logline === null) ? 'Not Available' : value.logline;
                            creditObj.budget = (value.estimatedBudget === 0 || value.estimatedBudget === null) ? 'Not Available' : '$' + numberFormatter(value.estimatedBudget);
                            creditObj.boxoffice = (value.box_office_income === 0 || value.box_office_income === null) ? 'Not Available' : '$' + numberFormatter(value.box_office_income);
                            creditArray.push(creditObj);
                            creditObj = {};
                        });
                        $scope.creditsData = creditArray;
                    }


                    $scope.awardsData = [];
                    var awardObj = {};
                    var awardsArray = [];
                    var i = 0;
                    if (!!result.awards && result.awards.length > 0) {
                        angular.forEach(result.awards, function (value, key) {
                            //console.log(i);
                            awardObj.name = (value.awardname === null) ? 'Not Available' : value.awardname;
                            awardObj.year = (value.release_date === null || value.release_date === '0000') ? 'Not Available' : value.release_date;
                            awardObj.type = (value.awardtype === null) ? 'Not Available' : value.awardtype;
                            awardObj.credit = (value.name === null) ? 'Not Available' : value.name;
                            awardObj.awardfor = (value.awardfor === null) ? 'Not Available' : value.awardfor;
                            awardsArray.push(awardObj);
                            awardObj = {};
                            i++;
                        });
                        $scope.awardsData = awardsArray;
                    }

                    $scope.commentsData = [];
                    var commentObj = {};
                    var commentArray = [];

                    if (!!result.comments && result.comments.length > 0) {
                        angular.forEach(result.comments, function (value, key) {
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
                    if (!!result.associateInfo && result.associateInfo.length > 0) {
                        angular.forEach(result.associateInfo, function (value, key) {
                            associateObj.associatename = value.type;
                            associateObj.firstname = value.firstName;
                            associateObj.lastname = value.lastName;
                            associateObj.email = value.email;
                            associateObj.phone = value.phone;
                            associateObj.companyname = value.companyname;
                            associateArray.push(associateObj);
                            typeArray.push(value.type);
                            associateObj = {};
                        });
                    }

                    if ($.inArray("Manager", typeArray) === -1) {
                        associateObj.associatename = 'Manager';
                        associateObj.firstname = '';
                        associateObj.lastname = '';
                        associateArray.push(associateObj);
                        associateObj = {};
                    }

                    if ($.inArray("Agent", typeArray) === -1) {
                        associateObj.associatename = 'Agent';
                        associateObj.firstname = '';
                        associateObj.lastname = '';
                        associateArray.push(associateObj);
                        associateObj = {};
                    }

                    if ($.inArray("Attorney", typeArray) === -1) {
                        associateObj.associatename = 'Attorney';
                        associateObj.firstname = '';
                        associateObj.lastname = '';
                        associateArray.push(associateObj);
                        associateObj = {};
                    }

                    if ($.inArray("Publicist", typeArray) === -1) {
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

            var getTalentAllDetailsById = function (talentId) {
                creditFactory.getAllNames()
                    .then(function (result) {
                        $scope.data.Credit = {};
                        $scope.data.Credit = result;
                        talentFactory.getTalentAllInfoById(talentId)
                            .then(function (result) {
                                $scope.activeElement = result;
                            });
                    });
                talentFactory.getTalentAllInfoById(talentId)
                    .then(function (result) {
                        $scope.activeElement = result;
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
                primary_role: {
                    "*": true
                },
                secondary_role: {
                    "*": true
                },
                primary_genre: {
                    "*": true
                },
                secondary_genre: {
                    "*": true
                }
            };

            // Storage for all data points for filters

            var allRole = localStorageService.get("role-*");
            if (allRole) {
                $scope.allRoleChecked = true;
                $('#role-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#role_list').css("display", "none");
            }

            var allGenre = localStorageService.get("genre-*");
            if (allGenre) {
                $scope.allGenreChecked = true;
                $('#genre-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#genre_list').css("display", "none");
            }

            var allGender = localStorageService.get("gender-*");
            if (allGender) {
                $scope.allGenderChecked = true;
                $('#gender-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#gender_list').css("display", "none");
            }

            var male = localStorageService.get("gender-Male");
            if (male && male.replace("gender-", "") === 'Male') {
                $scope.maleChecked = true;
                $('#gender-arrow').addClass('arrow-down').addClass('arrow-right');
                $('#gender_list').css("display", "block");
            }

            var female = localStorageService.get("gender-Female");
            if (female && female.replace("gender-", "") === 'Female') {
                $scope.femaleChecked = true;
                $('#gender-arrow').addClass('arrow-down').addClass('arrow-right');
                $('#gender_list').css("display", "block");
            }

            var allAge = localStorageService.get("age-*");
            if (allAge) {
                $scope.allAgeChecked = true;
                $('#age-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#age_list').css("display", "none");
            }

            var allEthnicity = localStorageService.get("ethnicity-*");
            if (allEthnicity) {
                $scope.allEthnicityChecked = true;
                $('#ethnicity-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#ethnicity_list').css("display", "none");
            }

            var allCountry = localStorageService.get("country-*");
            if (allCountry) {
                $scope.allCountryChecked = true;
                $('#country-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#country_list').css("display", "none");
            }

            var allCreatedBy = localStorageService.get("createdby-*");
            if (allCreatedBy) {
                $scope.allCreatedByChecked = true;
                $('#createdby-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#createdby_list').css("display", "none");
            }

            var allAward = localStorageService.get("award-*");
            if (allAward) {
                $scope.allAwardsChecked = true;
                $('#award-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#awards_list').css("display", "none");
            }

            var allBudget = localStorageService.get("budget-*");
            if (allBudget) {
                $scope.allBudgetChecked = true;
                $('#budget-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#budget_list').css("display", "none");
            }

            var allBoxOfficeRev = localStorageService.get("boxofficerev-*");
            if (allBoxOfficeRev) {
                $scope.allBoxOfficeRevChecked = true;
                $('#boxofficerev-arrow').removeClass('arrow-down').addClass('arrow-right');
                $('#box_office_income_list').css("display", "none");
            }

            angular.forEach($scope.ages, function (items) {
                if (items && items.name.trim()) {
                    var age = localStorageService.get("age-" + items.name.trim());
                    if (age && age.replace("age-", "") === items.name.trim()) {
                        items.checked = true;
                        $('#age-arrow').addClass('arrow-down').addClass('arrow-right');
                        $('#age_list').css("display", "block");
                    }
                }
            });

            angular.forEach($scope.budgets, function (items) {
                if (items && items.name.trim()) {
                    var budget = localStorageService.get("budget-" + items.name.trim());
                    if (budget && budget.replace("budget-", "") === items.name.trim()) {
                        items.checked = true;
                        $('#budget-arrow').addClass('arrow-down').addClass('arrow-right');
                        $('#budget_list').css("display", "block");
                    }
                }
            });

            angular.forEach($scope.boxofficerev, function (items) {
                if (items && items.name.trim()) {
                    var age = localStorageService.get("boxofficerev-" + items.name.trim());
                    if (age && age.replace("boxofficerev-", "") === items.name.trim()) {
                        items.checked = true;
                        $('#boxofficerev-arrow').addClass('arrow-down').addClass('arrow-right');
                        $('#box_office_income_list').css("display", "block");
                    }
                }
            });
            $scope.data = {
                Role: roleFactory.getNames(function (result) {
                    $scope.data.Role = result;
                    $scope.data.RolePriority = [];
                    $scope.data.RoleNonPriority = [];
                    $scope.activeData = $scope.data.Role;
                    angular.forEach(result, function (items) {
                        if (items && items.name.trim()) {
                            var roll = localStorageService.get("role-" + items.name.trim());
                            if (roll && roll.replace("role-", "") === items.name.trim()) {
                                items.checked = true;
                                $('#role-arrow').addClass('arrow-down').addClass('arrow-right');
                                $('#role_list').css("display", "block");
                            }
                            var getPeiorityRoll = (items.name.trim() === "Actor" || items.name.trim() === "Director" || items.name.trim() === "Producer" || items.name.trim() === "Writer");
                            if (getPeiorityRoll) {
                                $scope.data.RolePriority.push(items);
                            } else {
                                $scope.data.RoleNonPriority.push(items);
                            }
                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        $scope.filterData['primary_role'][result[i].name] = false;
                        $scope.filterData['secondary_role'][result[i].name] = false;
                    }
                }),
                TalentCreatedBy: talentFactory.getAllCreatedBy(function (result) {
                    angular.forEach(result, function (items) {
                        if (items && items.createdby.trim()) {
                            var createdby = localStorageService.get("createdby-" + items.createdby.trim());
                            if (createdby && createdby.replace("createdby-", "") === items.createdby.trim()) {
                                items.checked = true;
                                $('#createdby-arrow').addClass('arrow-down').addClass('arrow-right');
                                $('#createdby_list').css("display", "block");
                            }
                        }
                    });
                    $scope.data.createdByNames = result;
                }),
                TalentAwards: talentFactory.getAwardsNames(function (result) {
                    angular.forEach(result, function (items) {
                        if (items && items.awardname.trim()) {
                            var award = localStorageService.get("award-" + items.awardname.trim());
                            if (award && award.replace("award-", "") === items.awardname.trim()) {
                                items.checked = true;
                                $('#award-arrow').addClass('arrow-down').addClass('arrow-right');
                                $('#awards_list').css("display", "block");
                            }
                        }
                    });
                    $scope.data.awardsNameList = result;
                }),
                TalentCountryNames: talentFactory.getCountryNames(function (result) {
                    angular.forEach(result, function (items) {
                        if (items && items.country.trim()) {
                            var country = localStorageService.get("country-" + items.country.trim());
                            if (country && country.replace("country-", "") === items.country.trim()) {
                                items.checked = true;
                                $('#country-arrow').addClass('arrow-down').addClass('arrow-right');
                                $('#country_list').css("display", "block");
                            }
                        }
                    });
                    $scope.data.countryNames = result;
                }),
                Genre: genreFactory.getNames(function (result) {
                    $scope.data.GenrePriority = [];
                    $scope.data.GenreNonPriority = [];
                    $scope.data.Genre = result;
                    angular.forEach(result, function (items) {
                        if (items && items.name.trim()) {
                            var genre = localStorageService.get("genre-" + items.name.trim());
                            if (genre && genre.replace("genre-", "") === items.name.trim()) {
                                items.checked = true;
                                $('#genre-arrow').addClass('arrow-down').addClass('arrow-right');
                                $('#genre_list').css("display", "block");
                            }
                            var matchFound = (items.name.trim() === "Action" || items.name.trim() === "Comedy" || items.name.trim() === "Drama" || items.name.trim() === "Horror" || items.name.trim() === "Musical" || items.name.trim() === "Thriller");
                            if (matchFound) {
                                $scope.data.GenrePriority.push(items);
                            } else {
                                $scope.data.GenreNonPriority.push(items);

                            }
                        }
                    });
                    $scope.activeData = $scope.data.Genre;
                    for (var i = 0; i < result.length; i++) {
                        $scope.filterData['primary_genre'][result[i].name] = false;
                        $scope.filterData['secondary_genre'][result[i].name] = false;
                    }
                }),
                Ethnicity: ethnicityFactory.getNames(function (result) {
                    angular.forEach(result, function (items) {
                        if (items && items.name.trim()) {
                            var ethnicity = localStorageService.get("ethnicity-" + items.name.trim());
                            if (ethnicity && ethnicity.replace("ethnicity-", "") === items.name.trim()) {
                                items.checked = true;
                                $('#ethnicity-arrow').addClass('arrow-down').addClass('arrow-right');
                                $('#ethnicity_list').css("display", "block");
                            }
                        }
                    });
                    $scope.data.Ethnicities = result;
                })
            };

            // Toggles all checkboxes to true
            $scope.checkAll = function () {
                $('.filter-option').prop('checked', true);
                for (var col in $scope.filterData) {
                    if (typeof ($scope.filterData[col]) === "object") {
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
                    if (typeof ($scope.filterData[col]) === "object") {
                        for (var elem in $scope.filterData[col]) {
                            $scope.filterData[col][elem] = true;
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
                return textChecker(talent) && ($scope.filterData.primary_role['*'] || $scope.filterData.primary_role[talent.primary_role]) && ($scope.filterData.secondary_role['*'] || $scope.filterData.secondary_role[talent.secondary_role]) && ($scope.filterData.primary_genre['*'] || $scope.filterData.primary_genre[talent.primary_genre]) && ($scope.filterData.secondary_genre['*'] || $scope.filterData.secondary_genre[talent.secondary_genre]);
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


            var addFetchAssociateName = function (talentid, typeid, associate_id) {
                var dataList = [];
                $scope.agents = {};
                $scope.managers = {};
                $scope.attornies = {};
                $scope.publicists = {};
                $scope.agentname = {};
                $scope.managername = {};
                $scope.attornyname = {};
                $scope.publicistname = {};
                dataList['talent_id'] = talentid;
                dataList['associte_types_id'] = typeid;
                dataList['associate_id'] = associate_id;
                contactFactory.addGetAssociateNamesById(dataList, function (result) {
                    console.log('AssoResult');
                    console.log(result);
                    if (result.details.length > 0) {
                        angular.forEach(result.details, function (value, key) {
                            if (value.type === 'Agent') {
                                $scope.agentname = value.name;
                            }
                            if (value.type === 'Manager') {
                                $scope.managername = value.name;
                            }
                            if (value.type === 'Attorney') {
                                $scope.attornyname = value.name;
                            }
                            if (value.type === 'Publicist') {
                                $scope.publicistname = value.name;
                            }
                        })
                    }
                    $scope.agents = result.agents;
                    $scope.managers = result.managers;
                    $scope.attornies = result.attornies;
                    $scope.publicists = result.publicists;
                    if (result === "Error") {
                        alert("Error:Duplicate associate not allowed");
                        return false;
                    }
                });

            };

            $scope.submitManagement = function () {
                var dataList = [];
                if ($('#agent').val() && $('#agent').val() !== "") {
                    dataList['talent_id'] = $scope.activeElement.id;
                    dataList['associte_types_id'] = 1;
                    dataList['associate_id'] = $('#agent').val();
                    contactFactory.addGetAssociateNamesById(dataList, function (result) {
                        $scope.successmsgtalent = true;
                    });
                }

                if ($('#manager').val() && $('#manager').val() !== "") {
                    dataList['talent_id'] = $scope.activeElement.id;
                    dataList['associte_types_id'] = 2;
                    dataList['associate_id'] = $('#manager').val();
                    contactFactory.addGetAssociateNamesById(dataList, function (result) {
                        $scope.successmsgtalent = true;
                    });
                }

                if ($('#attorney').val() && $('#attorney').val() !== "") {
                    dataList['talent_id'] = $scope.activeElement.id;
                    dataList['associte_types_id'] = 3;
                    dataList['associate_id'] = $('#attorney').val();
                    contactFactory.addGetAssociateNamesById(dataList, function (result) {
                        $scope.successmsgtalent = true;
                    });
                }

                if ($('#publicist').val() && $('#publicist').val() !== "") {
                    dataList['talent_id'] = $scope.activeElement.id;
                    dataList['associte_types_id'] = 4;
                    dataList['associate_id'] = $('#publicist').val();
                    contactFactory.addGetAssociateNamesById(dataList, function (result) {
                        $scope.successmsgtalent = true;
                    });
                }

            }

            $scope.submitAssociate = function () {
                var getAssociateInfo = JSON.parse($scope.activeElement.associate_obj);
                addFetchAssociateName($scope.activeElement.id, getAssociateInfo.typeid, getAssociateInfo.id);
            };

            $scope.submitTalentCreditData = function () {
                //var credits = $('.talent-credit-select').val();
                var role = $('#rolesId').val() || null;
                //$scope.model.CreditInput.id
                var credits = [];
                if (angular.isUndefined($scope.model)) {
                    alert("Credit(s) is required filed.");
                    $("#creditEntry").focus();
                    return false;

                } else if (angular.isUndefined($scope.model.CreditInput)) {
                    alert("Credit(s) is required filed.");
                    $("#creditEntry").focus();
                    return false;
                } else if (role === null) {
                    alert("role is required filed.");
                    $("#rolesId").focus();
                    return false;
                }
                var creditsId = $scope.model.CreditInput.id;
                credits.push(creditsId);
                talentFactory.addTalentCreditJoin($scope.activeElement.id, credits, role, function (data) {
                    if (data.length !== $scope.activeElement.talentCreditJoins.length) {
                        $scope.showmsg.errorText = 'Credit(s) added to ' + $scope.activeElement.first_name + ' ' + $scope.activeElement.last_name;
                        $scope.activeElement.talentCreditJoins = data;
                        $scope.model = {};
                    } else {
                        $scope.showmsg.errorText = 'Credit(s) already exists';
                    }
                });
            };

            $scope.removeTalentCreditJoin = function ($event, join_id) {
                if(confirm("Do you really want to delete this credit?")){
                    talentFactory.removeTalentCreditJoin(join_id, function (data) {
                        $($event.target).parent().slideUp();
                        $($event.target).parent().remove();
                        $scope.showmsg.errorText = 'Credit removed from ' + $scope.activeElement.first_name + ' ' + $scope.activeElement.last_name;
                        $scope.activeElement.talentCreditJoins = data;
                    });
                }
            };

            $scope.getCreditsNames = function (val) {
                var talentNames = [];
                return creditFactory.getCreditsNames(val, angular.noop).then(function (result) {
                    return result.data;
                });
            };
            // Submit comment
            $scope.submitCommentPopUp = function () {
                // If text is in the textarea, submit the new comment
                if ($('.data-entry-comment-input').val() !== "") {
                    commentFactory.addComment($('.data-entry-comment-input').val(), $scope.activeElement.id, function (result) {
                        $scope.activeElement.comments.unshift(result);
                        //Once comment is added, append it to the comments-container and clear the textarea
                        $('.data-entry-comment-input').val('');
                    });
                }
            };


            // Remove comment when delete button is clicked
            $scope.removeComment = function ($event, comment_id) {
                var r = confirm("Do you really want to delete this comment?");
                if (r == true) {
                    $($event.target).parent().slideUp();
                    commentFactory.removeComment(comment_id);
                } else {
                    //return false;
                }
            };

            $scope.submitData = function () {
                dataSubmitter[$scope.section]();
            };
            $scope.closepopup = function () {
                $scope.activeElement = {};
                $(".hiddenPopUp").hide();
                $("#cover").hide();
            };
            var checkInputs = function (section) {
                var result = true;

                if (!section) {
                    $('input:visible, select:visible').each(function () {
                        if ($(this).attr('required')) {
                            console.log($(this).val());
                            if ($(this).val() === null || $(this).val().length === 0) {
                                result = false;
                            }
                        }
                    });
                } else {
                    $('.talent-form input:visible').each(function () {
                        if ($(this).attr('required')) {
                            if ($(this).val() === null || $(this).val().length === 0) {
                                result = false;
                            }
                        }
                        if ($(this).attr('validate') && $(this).attr('validate') === 'email' && $(this).val() !== '' && $(this).val() !== 'null') {
                            var re = /\S+@\S+\.\S+/;
                            if (re.test($(this).val()) === false) {
                                result = false;
                            }
                        }
                        if ($(this).attr('validate') && $(this).attr('validate') === 'phone' && $(this).val() !== '' && $(this).val() !== 'null') {
                            var re = /^\d{10}$/;
                            if (re.test($(this).val()) === false) {
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
                    //$scope.visibleTalent = $('.talent-table-row').length;
                    $scope.$apply();
                }, 100);

            };
            $(document).off('click').on('click', '.filter-header-container', function () {
                if ($(this).next('.filter-option-container').is(':visible')) {
                    $(this).next('.filter-option-container').hide();
                    $(this).find('.arrow').removeClass("arrow-down");
                    $(this).find('.arrow').addClass("arrow-right");

                } else {
                    $(this).next('.filter-option-container').show();
                    //$(this).find('.arrow').removeClass( "arrow-right" );
                    $(this).find('.arrow').addClass("arrow-down");
                }
                // $(this).next('.filter-option-container').slideToggle();


                $('.talent-left-col-container').hide();
                $('.talent-left-col-container').show();
            });


            $scope.getPartnerDetailsInfo = function () {
                //alert($scope.partner_id);
                addFetchAssociateName($scope.partner_id, -1, -1);
                $scope.setLoading(true);
                talentFactory.getTalentAllInfoById($scope.partner_id)
                    .then(function (result) {
                        $scope.activeElement = result.data;
                        $scope.showmsg = {};
                        $scope.agentModel = {};
                        $scope.section = 'Talent';
                        $scope.talentSection = 'main';
                        $scope.setLoading(false);
                        $("#cover").show();
                        $(".hiddenPopUp").show();
                        $('.talent-form-menu-button-active').removeClass('talent-form-menu-button-active');
                        $("#mainTab").addClass('talent-form-menu-button-active');

                    });
            };

    $scope.deleteTalentRecordPopUp = function() {
        if (confirm("Are you sure you want to delete this talent record ?")) {
            talentFactory.deleteTalent($scope.activeElement.id, function(){
                var index = _.findIndex($scope.talentGridOption.data, {'id': $scope.activeElement.id});;
                $scope.talentGridOption.data.splice(index, 1);
                $scope.activeElement = {};
                $(".hiddenPopUp").hide();
                $("#cover").hide();
                $('.talent-right-container-content').hide();
                $("#editLink").hide();
            });
        }
    };
    //start agent entry
    var addFetchAssociateName = function(){
      var associateObj = {};
      $scope.associateArray = [];
      $scope.allAgentDetails = [];
      var typeArray = [];
      var agentIDval = -1;
      talentFactory.talentProfile(checkRowId, function (result) {
        if (!!result.associateInfo && result.associateInfo.length > 0) {
              angular.forEach(result.associateInfo, function (value, key) {
                  associateObj.asdid = value.asdid;
                  associateObj.atypeid = value.atypeid;
                  associateObj.associatename = value.type =="NA"?"":value.type;
                  associateObj.firstname = value.firstName;
                  associateObj.lastname = value.lastName==null || value.lastName=="null"?"":value.lastName;
                  associateObj.fullname = value.firstName=='NA'?"":value.firstName+' '+associateObj.lastname;
                  associateObj.email = value.email=="null" || value.email==null?"":value.email;
                  associateObj.phone = value.phone==null || value.phone=="null"?"":value.phone;
                  associateObj.companyname = value.companyname==null || value.companyname=="null" || value.companyname=="NA"?"":value.companyname;
                  $scope.associateArray.push(associateObj);
                  //typeArray.push(value.type);
                  associateObj = {};
              });
        }
        talentFactory.getAgentDetailsData(agentIDval,function (allAgent) {
          $scope.allAgentDetails = allAgent;
        });

      });
    };

    var getAllAgentNameByType = function(){
       var agentTypeIdVal = parseInt($scope.addAgentRow.type);
      talentFactory.getAgentDetailsData(agentTypeIdVal,function (allAgent) {
          $scope.agentNameByType = allAgent;
          $scope.isNameDisabled = false;
        });
    };
    $scope.getAgentNameByType = function(){
      getAllAgentNameByType();
    };
    $scope.agentDataObj = function(){
      $scope.isCmpnyDisabled = false;
      var agnetNameObj =JSON.parse($scope.addAgentRow.name);
      if(angular.isUndefined(agnetNameObj.companyid) || agnetNameObj.companyid ==""){
        $scope.addAgentRow.companyNameId = "";
      }else{
        $scope.addAgentRow.companyNameId=agnetNameObj.companyid;
      }
      $scope.addAgentRow.Email = agnetNameObj.email==null?"":agnetNameObj.email;
      $scope.addAgentRow.Phone = agnetNameObj.Phone==null?"":agnetNameObj.Phone;
    };

    $scope.selectTaletCmpny = {
        formatNoMatches: function(term) {
            //console.log("Term: " + term);
            var message = '<a ng-click="addTagCmpnyName()" >Add:"' + term + '"</a>';
            if(!$scope.$$phase) {
                $scope.$apply(function() {
                    $scope.cmpnyNameNoResult = term;
                });
            }
            return message;
        }
    };

    $scope.selectTaletAgent = {
        formatNoMatches: function(term) {
            //console.log("Term: " + term);
            var message = '<a ng-click="addTagAgentName()">Add:"' + term + '"</a>';
            if(!$scope.$$phase) {
                $scope.$apply(function() {
                    $scope.talenNameNoResult = term;
                });
            }
            return message;
        }
    };

    $scope.addTagCmpnyName = function() {
      
        $scope.allAgentDetails.push({
            companyid: $scope.cmpnyNameNoResult+'#newCmpny',
            companyname: $scope.cmpnyNameNoResult
        });
        alert("New company name added into list.");
        //console.log("hiii");
    };

    $scope.addTagAgentName = function() {
        alert("New agent name added into list.");
        //$scope.addAgentRow.name = $scope.talenNameNoResult;
        $scope.agentNameByType.push({
            allAgentDetails: $scope.talenNameNoResult+'#newAgent',
            name: $scope.talenNameNoResult
        });
        //console.log("hiiiiiiiii");
        //console.log("hiii");
    };

    $scope.editAgentRecord = function($event,agentId,agentTypeId){
      var getIdsList = {};
      getIdsList['talentID']=$scope.activeElement.id;
      getIdsList['agentTypeid']=agentTypeId;
      getIdsList['agentID']=agentId;
      talentFactory.getTalenNamesDataById(getIdsList,function(result) {
              console.log(result);
              $scope.isAgentTypeDisabled = true;
              $scope.isNameDisabled = true;
              $scope.isCmpnyDisabled = false;
              $scope.addAgentPanel = false;
              $scope.updateAgentPanel = true;
              $scope.addAgentRow.updatedNameID = result[0].asdid;
              $scope.addAgentRow.updatedName = result[0].name;
              $scope.addAgentRow.type = result[0].atypeid;    
              $scope.addAgentRow.companyNameId = result[0].companyid;
              $scope.addAgentRow.Email = result[0].email;
              $scope.addAgentRow.Phone = result[0].phone;
        });
    };
    $scope.upDateAgentRow = function(){
      console.log($scope.addAgentRow);
        var dataList = {};
        if($scope.addAgentRow.Email=="" || angular.isUndefined($scope.addAgentRow.Email)){
            dataList['email_id'] = null;
        }else{
            if(validateEmail($scope.addAgentRow.Email)){
              dataList['email_id'] = $scope.addAgentRow.Email;
            }else{
              alert("Please enter valid email Id.");
              return false;
            }
            
        }
        if($scope.addAgentRow.Email=="" || angular.isUndefined($scope.addAgentRow.Email)){
            dataList['phone_num'] = null;
        }else{
           var PhoneNumber = $scope.addAgentRow.Phone.replace(/[\s()-]+/gi, '');
          if(PhoneNumber.length!==10 || isNaN(PhoneNumber)){
            alert("Please enter valid phone number.");
            return false;
          }
            dataList['phone_num'] = $scope.addAgentRow.Phone;
        }
        
        dataList['type'] = $scope.addAgentRow.type;
        dataList['agent_id'] = $scope.addAgentRow.updatedNameID;
        dataList['talentID']=$scope.activeElement.id;
        dataList['companynameIdVal']=$scope.addAgentRow.companyNameId;
        talentFactory.updateAgentRowDetailsById(dataList,function(result) {
            if(result.status=="error"){
                alert(result.text);
                 return false;
              }else{
                addFetchAssociateName();
                applyCancel();
                alert(result.text);
                return false;
              }


        });

    };
    var applyCancel = function(){
      $scope.addAgentRow = {};
      $scope.addAgentPanel = true;
      $scope.updateAgentPanel = false;
      $scope.isAgentTypeDisabled = false;
    };
    $scope.cancelAgentRow = function(){
        applyCancel();

    };
    $scope.$watch('talenNameNoResult', function(newVal, oldVal) {
        if(newVal && newVal !== oldVal) {
            $timeout(function() {
                var noResultsLink = $('.select2-no-results');
                console.log(noResultsLink.contents());
                $compile(noResultsLink.contents())($scope);
            });
        }
    }, true);

    $scope.$watch('cmpnyNameNoResult', function(newVal, oldVal) {
        if(newVal && newVal !== oldVal) {
            $timeout(function() {
                var noResultsLink = $('.select2-no-results');
                console.log(noResultsLink.contents());
                $compile(noResultsLink.contents())($scope);
            });
        }
    }, true);

    $scope.removeAgent = function($event,asdid,atypeid){
      if(confirm("Are you sure you want to delete this record?")){
        var indexVal = _.findIndex($scope.associateArray, {'asdid': asdid});
        // $scope.associateArray.splice(indexVal, 1);
        // return false;
        talentFactory.removeTalentAgentJoin($scope.activeElement.id,asdid,atypeid,function(result) {
              $scope.associateArray.splice(indexVal, 1);
        });
      }   
    };

    $scope.clearAgentAddRow = function(){
      $scope.addAgentRow = {};
    };

    $scope.addAgentRowData = function(){
      var objectForamtted = {};
      console.log($scope.addAgentRow);
      var isNewRow = 0;
      var nameArray = {};
      if($scope.addAgentRow.type=="0" || angular.isUndefined($scope.addAgentRow.type)){
        $scope.addAgentRow.type = 5;
      }
      if($scope.addAgentRow.name=="" || angular.isUndefined($scope.addAgentRow.name)){
        nameArray.name = 'NA';
      }
      if(angular.isUndefined($scope.addAgentRow.companyNameId) || $scope.addAgentRow.companyNameId==null){
          alert("Please select company name.");
          return false;
        }
        else if($scope.addAgentRow.companyNameId==472 && nameArray.name=='NA'){
            alert("Please select either Company name or Agent name.");
            return false;
        }
        if($scope.addAgentRow.type!==5){
          nameArray = JSON.parse($scope.addAgentRow.name);
        }
        if(angular.isUndefined(nameArray.asdid) || angular.isUndefined(nameArray.atypeid)){
            objectForamtted['agentNameid'] = nameArray.name;
            objectForamtted['agentTypeid'] = $scope.addAgentRow.type;
            isNewRow = 1;
        }else{
            objectForamtted['agentNameid'] = nameArray.asdid;
            objectForamtted['agentTypeid'] = nameArray.atypeid;
        }
        var isNewCmp = (($scope.addAgentRow.companyNameId).toString()).indexOf("#");
        if(isNewCmp!=-1){
          var cmnyArray = $scope.addAgentRow.companyNameId.split('#');
          objectForamtted['cmpnyId'] = cmnyArray[0];
          isNewRow = 1;
        }else{
          objectForamtted['cmpnyId'] = $scope.addAgentRow.companyNameId;
        }

        if($scope.addAgentRow.Email==null || angular.isUndefined($scope.addAgentRow.Email) || $scope.addAgentRow.Email ==""){
          objectForamtted['agentEmail'] = null;
        }else{
          if(validateEmail($scope.addAgentRow.Email)){
              objectForamtted['agentEmail'] = $scope.addAgentRow.Email;
            }else{
              alert("Please enter valid email Id.");
              return false;
            }
        }
        if($scope.addAgentRow.Phone==null || angular.isUndefined($scope.addAgentRow.Phone) || $scope.addAgentRow.Phone ==""){
          objectForamtted['agentPhone'] = null;
        }else{
          var PhoneNumber = $scope.addAgentRow.Phone.replace(/[\s()-]+/gi, '');
          if(PhoneNumber.length!==10 || isNaN(PhoneNumber)){
            alert("Please enter valid phone number.");
            return false;
          }
          objectForamtted['agentPhone'] = $scope.addAgentRow.Phone; 
        }
        if(angular.isUndefined($scope.addAgentRow.type)){
            objectForamtted['agentTypeIDVal']  = null;
        }else if(angular.isDefined($scope.addAgentRow.type)){
          if($scope.addAgentRow.type ==="0"){
            objectForamtted['agentTypeIDVal'] = null;
          }else{
              objectForamtted['agentTypeIDVal'] = $scope.addAgentRow.type;
          }
        }
        
      objectForamtted['talentId'] = $scope.activeElement.id;
      talentFactory.addAgentDetails(isNewRow,objectForamtted,function(result) {
              console.log(result.status);
              if(result.status=="error"){
                alert(result.text);
                 return false;
              }else{
                addFetchAssociateName();
                $scope.addAgentRow = {};
                $scope.agentNameByType.length=0;
                $scope.isCmpnyDisabled = true;
                $scope.isNameDisabled = true;
                alert(result.text);
                return false;
              }
        });
    };
    //End agent Entry

            $scope.applyReset = function(){
                    $scope.filerByname = "";
                    $('.filter-option').prop('checked', false);
                    $('.all-option').prop('checked', true);

                    $('div#role_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("role-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allRole", "unchecked");
                        }
                        localStorageService.set("role-" + $(this).val().trim(), "");
                    }
                });



                $('div#genre_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("genre-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allGenre", "unchecked");
                        }
                        localStorageService.set("genre-" + $(this).val().trim(), "");
                    }
                });

                $('div#gender_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("gender-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allGender", "unchecked");
                        }
                        localStorageService.set("gender-" + $(this).val().trim(), "");
                    }
                });

                $('div#age_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("age-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allAge", "unchecked");
                        }
                        localStorageService.set("age-" + $(this).val().trim(), "");
                    }
                });

                $('div#ethnicity_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("ethnicity-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allEthnicity", "unchecked");
                        }
                        localStorageService.set("ethnicity-" + $(this).val().trim(), "");
                    }
                });

                $('div#country_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("country-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allCountry", "unchecked");
                        }
                        localStorageService.set("country-" + $(this).val().trim(), "");
                    }
                });

                $('div#createdby_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("createdby-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allCreatedBy", "unchecked");
                        }
                        localStorageService.set("createdby-" + $(this).val().trim(), "");
                    }
                });

                $('div#awards_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("award-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allAward", "unchecked");
                        }
                        localStorageService.set("award-" + $(this).val().trim(), "");
                    }
                });

                $('div#budget_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("budget-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allBudget", "unchecked");
                        }
                        localStorageService.set("budget-" + $(this).val().trim(), "");
                    }
                });

                $('div#box_office_income_list input').each(function () {
                    if ($(this).val().trim() !== "" && $(this).prop("checked")) {
                        localStorageService.set("boxofficerev-" + $(this).val().trim(), $(this).val().trim());
                    } else {
                        if ($(this).val().trim() === '*') {
                            localStorageService.set("allBoxOfficeRev", "unchecked");
                        }
                        localStorageService.set("boxofficerev-" + $(this).val().trim(), "");
                    }
                });
                    filterAll();
            };

            $(document).on('click', '#exportLink', function () {
                var selectedTalentRowId = {};
                selectedTalentRowId.pay = [];
                if (!$scope.gridApi.selection.getSelectedRows().length) {
                    return false;
                }
                angular.forEach($scope.gridApi.selection.getSelectedRows(), function (items) {
                    selectedTalentRowId.pay.push(items.id);
                });
                console.log(selectedTalentRowId);
                talentFactory.exportTalentDetailXls(selectedTalentRowId, function (result) {
                    $scope.data.Contact = result;
                });

            });
            $(document).on('click', '#editLink', function () {
                //getTalentAllDetailsById($scope.getTalentData.id);
                addFetchAssociateName($scope.getTalentData.id, -1, -1);
                $scope.setLoading(true);
                talentFactory.getTalentAllInfoById($scope.getTalentData.id)
                    .then(function (result) {
                        $scope.activeElement = result.data;
                        $scope.inputPartner = result.data.partner;
                        $scope.showmsg = {};
                        $scope.model = {};
                        $scope.agentModel = {};
                        $scope.section = 'Talent';
                        $scope.talentSection = 'main';
                        
                        $scope.setLoading(false);
                        $("#cover").show();
                        $(".hiddenPopUp").show();
                        $('.talent-form-menu-button-active').removeClass('talent-form-menu-button-active');
                        $("#mainTab").addClass('talent-form-menu-button-active');

                    });

            });
            $("#phoneNumberIdTalent").mask("(999)999-9999");
            $("#phoneNumberIdTalent").on("blur", function() {
                var last = $(this).val().substr( $(this).val().indexOf("-") + 1 );
                
                if( last.length == 3 ) {
                    var move = $(this).val().substr( $(this).val().indexOf("-") - 1, 1 );
                    var lastfour = move + last;
                    
                    var first = $(this).val().substr( 0, 9 );
                    
                    $(this).val( first + '-' + lastfour );
                }
              });
    
        });
})();