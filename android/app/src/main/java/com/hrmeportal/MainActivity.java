
package com.hrmeportal;
import com.facebook.react.ReactActivity;
import android.os.Bundle; //<- Plash screen
import org.devio.rn.splashscreen.SplashScreen; //<- Plash screen
import com.facebook.react.ReactActivityDelegate; //<- fix error click outside close drawer
import com.facebook.react.ReactRootView;//<- fix error click outside close drawer
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;//<- fix error click outside close drawer

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "HRMePortal";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, true);  // <- second parameter is true, to hide StatusBar
    super.onCreate(savedInstanceState);
  }//<- Plash screen
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  } //<- fix error click outside close drawer
}
