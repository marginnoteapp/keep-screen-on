/**
 * MIT License
 * Copyright (c) 2022 MarginNote
 * Github: https://github.com/marginnoteapp/keepscreenon
 * Welcom to contribute to this project!
 */

try {
  const Addon = {
    name: "Keep Screen ON",
    key: "keepscreenon"
  }
  const console = {
    log(obj, suffix = "normal") {
      JSB.log(`${Addon.key}-${suffix} %@`, obj)
    }
  }
  const zh = {
    on: "「保持屏幕常亮」已开启",
    off: "「保持屏幕常亮」已关闭"
  }
  const en = {
    on: `"Keep Screen ON" is ON`,
    off: `"Keep Screen ON" is OFF`
  }
  JSB.newAddon = () => {
    const lang =
      NSLocale.preferredLanguages().length &&
      NSLocale.preferredLanguages()[0].startsWith("zh")
        ? zh
        : en
    const showHUD = (text, duration = 2) => {
      Application.sharedInstance().showHUD(text, self.window, duration)
    }
    return JSB.defineClass(
      Addon.name + ": JSExtension",
      {
        sceneWillConnect() {
          self.app = Application.sharedInstance()
          self.studyController = self.app.studyController(self.window)
          self.status =
            NSUserDefaults.standardUserDefaults().objectForKey(Addon.key)
              .status ?? false
        },
        documentDidOpen(docmd5) {
          if (!self.docmd5 && self.status) {
            showHUD(lang.on)
            UIApplication.sharedApplication().idleTimerDisabled = true
          }
          self.docmd5 = docmd5
        },
        queryAddonCommandStatus() {
          return {
            image: "logo_44x44.png",
            object: self,
            selector: "onToggle:",
            checked: self.status
          }
        },
        onToggle() {
          self.status = !self.status
          UIApplication.sharedApplication().idleTimerDisabled = self.status
          showHUD(self.status ? lang.on : lang.off)
          self.studyController.refreshAddonCommands()
          NSUserDefaults.standardUserDefaults().setObjectForKey(
            { status: self.status },
            Addon.key
          )
        }
      },
      {}
    )
  }
} catch (err) {
  JSB.log(`keepscreenon-error %@`, err)
}
