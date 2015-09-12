
nya = new(filenameNoZip)

import datetime
today = datetime.date.today()

last6Weeks = today - datetime.timedelta(days=42)
date_string = last6Weeks.strftime("%Y-%m-%d")
senaste_6veckorna = nya.filter('"Inkomdatum" > todate(\'%s\')' % date_string).save("senaste_6veckorna")

lastMonth = today - datetime.timedelta(days=31)
date_string = lastMonth.strftime("%Y-%m-%d")
senaste_manaden = senaste_6veckorna.filter('"Inkomdatum" > todate(\'%s\')' % date_string).save("senaste_manaden")

lastWeek = today - datetime.timedelta(days=7)
date_string = lastWeek.strftime("%Y-%m-%d")
senaste_veckan = senaste_manaden.filter('"Inkomdatum" > todate(\'%s\')' % date_string).save("senaste_veckan")


senaste_veckan.addAreaField()
senaste_manaden.addAreaField()
senaste_6veckorna.addAreaField()

senaste_veckan.makeJSON("senaste_veckan.json")
senaste_manaden.makeJSON("senaste_manaden.json")
senaste_6veckorna.makeJSON("senaste_6veckorna.json")

from shutil import copyfile
copyfile("senaste_veckan.json", "../../json/"+filenameNoZip+"/senaste_veckan.json")
copyfile("senaste_manaden.json", "../../json/"+filenameNoZip+"/senaste_manaden.json")
copyfile("senaste_6veckorna.json", "../../json/"+filenameNoZip+"/senaste_6veckorna.json")

del nya
del senaste_manaden
del senaste_veckan
del senaste_6veckorna
