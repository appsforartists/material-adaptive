/**
 * Controller for Navigation Frame.
 */
class FrameController {

  constructor($rootScope, $window, $mdSidenav, $mdMedia, $mdBottomSheet, $mdToast, $log, $state, $location, ShrineDomUtils, SharingService, ItemsService) {
    this.$log = $log.getInstance("FrameController");
    this.$log.debug("instanceOf()");

    this.location_ = $location;
    this.isDetailView = ($state.current.name == 'root.category.detail');
    this.categories = ItemsService.categories;
    this.sharingOptions = SharingService.sharingOptions;

    this.$state = $state;
    this.$mdToast = $mdToast;
    this.$mdSidenav = $mdSidenav;
    this.$mdMedia = $mdMedia;
    this.$mdBottomSheet = $mdBottomSheet;
    this.$window = $window;
    this.ShrineDomUtils = ShrineDomUtils;

    this.updateSelectedTab()

    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, FromParams) => {
      this.$log.debug("Got state change");
      this.$log.debug(toState);
      this.isDetailView = toState.name == 'root.category.detail';
      this.updateSelectedTab();
    });
  }

  /**
   * Update the selected tab to match the category in the URL.
   */
  updateSelectedTab() {
    this.categories.forEach( (category, idx) => {
      if (category.url == this.$state.params.category) {
        this.setTabIndex(idx);
      }
    });
  }

  /**
   * Deprecated (cristobalchao@): Haven't been able to make $mdMedia to work with responsive actions.
   * Opens the sharing menu, either using a bottom sheet or popup menu as appropriate.
   */
  openShareMenu() {
    this.$log.debug( "openShareMenu() ");
    if (this.$mdMedia('sm')) {
      return this.$mdBottomSheet.show({
        templateUrl: 'src/store/sharingmenu/sharingmenu.html',
        controller: 'SharingMenuController',
        controllerAs: 'ctrl',
        locals: {
          'acknowledgeAction': this.acknowledgeAction
        }
      }).then(function(option) {
        this.acknowledgeAction(option);
      });
    }
  }

  /**
   * Opens the sharing menu, either using a bottom sheet or popup menu as appropriate.
   */
  openMenu($mdOpenMenu, ev) {
    ev.stopPropagation();
    this.$log.debug( "openMenu() ");
    var vw = this.ShrineDomUtils.getCurrentViewport();

    if (vw.minWidth <= 480) {
      return this.$mdBottomSheet.show({
        templateUrl: 'src/store/sharingmenu/sharingmenu.html',
        controller: 'SharingMenuController',
        controllerAs: 'ctrl',
        locals: {
          'acknowledgeAction': this.acknowledgeAction
        }
      }).then(function(option) {
        this.acknowledgeAction(option);
      });
    }    
  }

  /**
   * Show the search view.
   */
  openSearch() {
    this.$state.go('root.search');
  }

  /**
   * Handles a swipe event.
   *
   * @param intention The intended action of the swipe event. 
   */
  handleSwipe(intention) {
    this.$log.debug( "handleSwipe() ");
    if (this.$mdMedia('sm')) {
      switch (intention) {
        case 'open':
          this.$mdSidenav('left').open();
          break;
        case 'close': 
          this.$mdSidenav('left').close();
          break;
      } 
    }
  }

  /**
   * Navigate to the previous URL in history.
   */
  goBack() {
    // this.$window.history.back();
    this.location_.path('/');
  }

  /**
   * Hide or Show the category menu.
   */
  toggleMenu() {
    this.$log.debug( "toggleMenu() ");
    this.$mdSidenav('left').toggle();
  }

  /**
   * Select a category.
   * @param index Index of the selected category.
   */
  selectCategory(category) {
    this.$log.debug( "selectCategory() ");
    this.$mdSidenav('left').close()
    this.$state.go('root.category', {category: category.url});
  }

  /**
   * Sets tab index, if no index is provided set index to 0.
   * @param {integer} idx The new tab index.
   */
  setTabIndex(idx) {
    this.$log.debug( "setTabIndex() ");
    this.selectedIdx = idx || 0;
  }

  /**
   * Returns the currently selected category.
   */
  currentCategory() {
//    this.$log.debug( "currentCategory() ");
    return this.categories[this.selectedIdx];
  }

  /**
   * Shows a toast message to recognized the click, acknowleding an action would have taken place.
   * @param option The option to acknowledge the action of.
   */
  acknowledgeAction(option) {
    this.$log.debug( "acknowledgeAction() ");
    switch (option) {
      case 'shopping_cart':
        var message = 'You clicked the shopping cart.  We could show a shopping cart modal if we have one.';
        break;
      case 'twitter':
        var message = 'You clicked the Twitter action.  We could launch into twitter sharing.';
        break;
      case 'email':
        var message = 'You clicked the email action.  We could launch into an email widget.';
        break;
      case 'message':
        var message = 'You clicked message action.  We could launch a messaging widget';
        break;
      case 'facebook':
        var message = 'You clicked Facebook action.  We could launch a Facebook widget';
        break;
      default:
        var message = 'You clicked on an item.  We could take an action now.';
    }
    this.$mdToast.show(this.$mdToast.simple().content(message));
  }
}

FrameController.$inject = ['$rootScope', '$window', '$mdSidenav', '$mdMedia', '$mdBottomSheet', '$mdToast', '$log', '$state', '$location', 'ShrineDomUtils', 'SharingService', 'ItemsService'];
export default FrameController;