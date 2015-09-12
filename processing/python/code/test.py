# -*- coding: windows-1250 -*-

from qgis.core import *;
from operate import Map;


map = Map('..\\data_\\AvverkningNya-05.shp');

#map = QgsMapCanvas();
#print(map)

#feat = QgsFeature()
#allAttrs = provider.attributeIndexes()
#import code
#code.interact(local=locals())
#while provider.nextFeature(feat):


#from datetime import datetime
#from dateutil.relativedelta import relativedelta
#date_last_month = datetime.today() - relativedelta(months=1)
#date_string = datetime.today().strftime('%Y-%m-%d')
import datetime
today = datetime.date.today()
lastMonth = today - datetime.timedelta(days=31)
date_string = lastMonth.strftime("%Y-%m-%d")

select_string = '"INKOMDATUM" > todate(\''+date_string+'\')';

#fields = layer.pendingFields() # the fields (attribute collumn descriptor) of the layer in to-commit state.
#exp.prepare(fields) # lookup inkomdatum-collumn-index
#for feat in layer.getFeatures():
#  if not exp.evaluate(feat):
#	continue

map.filter(select_string).save("filtered.shp")
filtered = Map("filtered.shp")


#for feat in map.filter(select_string):
  # fetch geometry
#  geom = feat.geometry()
#  print "Feature ID %d: " % feat.id() ,

#  import code
#  code.interact(local=locals())

  # show some information about the feature
#  if geom.type() == QGis.Polygon:
#    x = geom.asPolygon()
#    numPts = 0
#    for ring in x:
#      numPts += len(ring)
#    print "Polygon: %d rings with %d points" % (len(x), numPts)
#  else:
#    print "Unknown"

import code
code.InteractiveConsole(locals=globals()).interact()

