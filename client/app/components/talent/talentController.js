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
                    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
                }
                if (num >= 1000000) {
                    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                }
                if (num >= 1000) {
                    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
                }
                return num;
            }
            talentFactory.getAll(function (data) {
                angular.forEach(data,function(items){
                    if(items.estimatedBudget !==null && items.estimatedBudget){
                        var estimatedBudgets = items.estimatedBudget.split(',');
                        var maxBudget = Math.max.apply(Math, estimatedBudgets);
                        maxBudget = numberFormatter(parseInt(maxBudget));
                        var minBudget = Math.min.apply(Math, estimatedBudgets);
                        minBudget = numberFormatter(parseInt(minBudget));
                        items.estimatedBudget = '$'+minBudget+'-'+'$'+maxBudget;
                    }
                    if(items.boxOfficeIncome !==null && items.boxOfficeIncome){
                        var boxOfficeIncomes = items.boxOfficeIncome.split(',');
                        var maxIncome = Math.max.apply(Math, boxOfficeIncomes);
                        maxIncome = numberFormatter(parseInt(maxIncome));
                        var minIncome = Math.min.apply(Math, boxOfficeIncomes);
                        minIncome = numberFormatter(parseInt(minIncome));
                        items.boxOfficeIncome = '$'+minIncome+'-'+'$'+maxIncome;
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
                    var findFlag = false;
                    var selectedNames ="";
                    var validNameInput = ($scope.filerByname!==null) && !(angular.isUndefined($scope.filerByname)) && ($scope.filerByname !=="");
        
                    if(validNameInput){
                        selectedNames = $scope.filerByname;
                        if(item.name !==null){
                            if(item['name'].toLowerCase().search(selectedNames)!==-1){
                                findNameFlag = true;
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
                    if($("input#allRole").is(':checked')){
                        findRoleFlag = true;
                    }
                    if($("input#allCountries").is(':checked')){
                        findCountryFlag = true;
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
                    if(findNameFlag && findRoleFlag && findGenresFlag && findGenderFlag && findCountryFlag && findCreatedByFlag && findEthnicityFlag && findAgeFlag){
                        findFlag = true;
                    }
                    return findFlag;
                });
            };
            var updateMainTalent = function (talentId) {
                $scope.deletedComments = 0;
                talentFactory.talentProfile(talentId, function (result) {
                    $scope.mainTalent = result[0];
                    var phoneNumber = result[0].phone;
                    if(phoneNumber !== null){
                    	var formattedNo = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                    }else{
                    	var formattedNo = '';
                    }
                    $scope.mainTalent.phone = formattedNo;
                    
                    $scope.mainTalent.facebookurl = 'http://www.'+result[0].facebookurl;
                    $scope.mainTalent.instagramurl = 'http://www.'+result[0].instagramurl;
                    $scope.mainTalent.twitterurl = 'http://www.'+result[0].twitterurl;
                    $scope.mainTalent.vineurl = 'http://www.'+result[0].vineurl;
                    $scope.mainTalent.youtubeurl = 'http://www.'+result[0].youtubeurl;
                    
                    $scope.creditsData = [];
                    var creditObj = {};
                    var creditArray = [];
                    if(result[0].creditsreleaserole!==null){
                        var dataObj = result[0].creditsreleaserole.split('|');
                        angular.forEach(dataObj, function(value, key) {
                    	  if(value){
                    		  var arr = value.trim().split(',');
                    			angular.forEach(arr, function(value2, key2) {
                    				if(key2 === 0){
                    					creditObj.title = value2.trim();
                    				}
                    				if(key2 === 1){
                    					creditObj.releasedate = value2.trim();
                    				}
                    				if(key2 === 2){
                    					creditObj.roll = value2.trim();
                    				}
                    				if(key2 === 3){
                    					creditObj.budget = '$'+value2.trim().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    				}
                    				if(key2 === 4){
                    					creditObj.boxoffice = '$'+value2.trim().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    				}
                    			});
                    			creditArray.push(creditObj);
                    			creditObj = {};
                    	  }
                    	});
                        $scope.creditsData = creditArray;
                    }
                    
                    $scope.awardsData = [];
                    var awardObj = {};
                    var awardsArray = [];
                    if(result[0].awardtypecredit!==null){
                        var awardsObj = result[0].awardtypecredit.split('|');
                        angular.forEach(awardsObj, function(value, key) {
                      	  if(value){
                      		var arr = value.trim().split(',');
                			angular.forEach(arr, function(value2, key2) {
                				if(key2 === 0){
                					awardObj.name = value2.trim();
                				}
                				if(key2 === 1){
                					awardObj.year = value2.trim();
                				}
                				if(key2 === 2){
                					awardObj.type = value2.trim();
                				}
                				if(key2 === 3){
                					awardObj.credit = value2.trim();
                				}
                				if(key2 === 4){
                					awardObj.awardfor = value2.trim();
                				}
                			});
                			awardsArray.push(awardObj);
                			awardObj = {};
                      	  }
                      	});
                        $scope.awardsData = awardsArray;
                    }
                    
                    $scope.commentsData = [];
                    var commentObj = {};
                    var commentArray = [];
                    if(result[0].commentsData!==null){
                        var commentsObj = result[0].commentsData.split('|');
                        angular.forEach(commentsObj, function(value, key) {
                      	  if(value){
                      		var arr = value.trim().split(',');
                  			angular.forEach(arr, function(value2, key2) {
                  				if(key2 === 0){
                  					commentObj.comment = value2.trim();
                  				}
                  				if(key2 === 1){
                  					commentObj.date = value2.trim();
                  				}
                  				if(key2 === 2){
                  					commentObj.firstname = value2.trim();
                  				}
                  				if(key2 === 3){
                  					commentObj.lastname = value2.trim();
                  				}
                  			});
                  			commentArray.push(commentObj);
                  			commentObj = {};
                      	  }
                      	});
                        $scope.commentsData = commentArray;
                    }
                    
                    $scope.associateData = [];
                    var associateObj = {};
                    var associateArray = [];
                    if(result[0].associateInfo!==null){
                        var associateDataObj = result[0].associateInfo.split('|');
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
                	$scope.comStatus = false;
                    commentFactory.addComment($('.comment-input').val(), $scope.mainTalent.id, function (result) {
                        if(result !== null){
                        	$scope.comStatus = true;
                        	$scope.commentMsg = 'Comments added successfully';
                        }
                    	//$scope.mainTalent.comments.push(result);
                        //Once comment is added, append it to the comments-container and clear the textarea
                        $('.comment-input').val('');
                    });
                }
            };
            $scope.removeComment = function ($event, comment_id) {
                $($event.target).parent().slideUp();
                commentFactory.removeComment(comment_id);
                $scope.deletedComments++;
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