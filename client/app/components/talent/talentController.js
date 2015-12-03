(function () {
    'use strict';
    angular.module('talentController', ['talentFactory', 'contactFactory', 'roleFactory', 'genreFactory', 'commentFactory', 'talentGridFactory'])
        .controller('talentController', function ($scope, talentFactory, contactFactory, creditFactory, roleFactory, genreFactory, commentFactory, talentGridFactory) {

            ///////////////////////////////
            /// Initialize View
            ///////////////////////////////
            $scope.term ="";
            var filereName = $scope.term;
            $scope.talentGridOption = {};
            $scope.talentGridOption = talentGridFactory.getGridOptions();
            talentFactory.getAll(function (data) {
                console.log(data);
                $scope.talentGridOption.data = data;
                $scope.talentCount = data.length;
                $scope.visibleTalent = data.length;
                $("span.ui-grid-pager-row-count-label").text(" Records per page");
            });

            $scope.mainTalent = false;
            $scope.activeSection = 'info';
            $scope.filterColumn = 'last_name';
            $scope.deletedComments = 0;

            $scope.talentGridOption.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        var msg = 'row selected ' + row.isSelected;
                        if(row.isSelected){
                            console.log(row.entity.id);
                            updateMainTalent(row.entity.id);
                        }
                        //console.log(msg);
                    });
            };
            // Adds talent content into right div
            $scope.updateGridData = function (searchVal) {
                $scope.term = searchVal;
                $scope.gridApi.grid.refresh()
            };

            var updateMainTalent = function (talentId) {
                $scope.deletedComments = 0;
                talentFactory.talentProfile(talentId, function (result) {
                    $scope.mainTalent = result;
                    // Set default picture if talent does not have a picture url in database
                    $scope.mainTalent.photo_url = $scope.mainTalent.photo_url || "assets/img/default-talent-pic.png";
                });


                // Remove active-talent class from other row, if another row is active
                $('.active-talent').each(function () {
                    $(this).removeClass('active-talent');
                });

                // Add active-talent class to the row that was clicked on
                //$($event.target).parent().addClass('active-talent');
            };


            $scope.updateTalentSection = function ($event, section) {
                $('.right-talent-container-menu-link').removeClass('active-talent-link');
                $($event.target).addClass('active-talent-link');
                $scope.activeSection = section;
            };

            $scope.updateFiltersClick = function ($event) {
                var element = $($event.target);
                // When a filter is clicked, toggle it's status
                $scope.filterData[element.attr('col')][element.attr('value')] = !$scope.filterData[element.attr('col')][element.attr('value')];

                if (!element.hasClass('all-option')) {
                    $scope.filterData[element.attr('col')]['*'] = false;
                    $('.all-option[col="' + element.attr('col') + '"]').prop('checked', false);
                }
                updateVisibleCount();
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
                // gender: {"*": true, male: false, female: false}
            };

            // Storage for all data points for filters
            $scope.data = {
                Role: roleFactory.getNames(function (result) {
                    $scope.data.Role = result;
                    $scope.activeData = $scope.data.Role;

                    // Add data into filter object
                    for (var i = 0; i < result.length; i++) {
                        $scope.filterData['primary_role'][result[i].name] = false;
                        $scope.filterData['secondary_role'][result[i].name] = false;
                    }
                }),
                Genre: genreFactory.getNames(function (result) {
                    $scope.data.Genre = result;
                    $scope.activeData = $scope.data.Genre;

                    // Add data into filter object
                    for (var i = 0; i < result.length; i++) {
                        $scope.filterData['primary_genre'][result[i].name] = false;
                        $scope.filterData['secondary_genre'][result[i].name] = false;
                    }
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
                    commentFactory.addComment($('.comment-input').val(), $scope.mainTalent.id, function (result) {
                        $scope.mainTalent.comments.push(result);
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