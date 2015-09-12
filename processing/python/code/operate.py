import fileops;

import json;
import os;
import qgis;
from PyQt4.QtCore import *;
from PyQt4.QtGui import *;
from qgis.core import *;
from qgis.gui import *;
#import qgis.utils;
#qgis.utils.uninstallErrorHook();

#from qgis.core import QgsExpression;

print "Trying to obtain OSGEO4W_ROOT"
qgis_prefix = os.getenv("OSGEO4W_ROOT") + "\\apps\\qgis" 
print(qgis_prefix)
print "initing qgis"
QgsApplication.setPrefixPath(qgis_prefix, True)
QgsApplication.initQgis();
print "qgis inited!"


#

codepage = 'CP1250'
#codepage = 'CP437'

class Map:
	def __init__(self, mapFileName = None):
		if mapFileName is None:
			return

			self.name = mapFileName;
		self.layer = QgsVectorLayer(mapFileName, mapFileName, 'ogr')
		if not self.layer.isValid():
			raise Exception("Invalid map file specified: %s" % mapFileName)
		self.provider = self.layer.dataProvider();
		#print("Data provider name: " + self.provider.name());
		
	def makeMemoryLayer(self):
		derp = Map()
	
		name = "temp_crap_files/memory_buffer_%d.shp" % id(derp)

		fields = self.provider.fields()
		writer = QgsVectorFileWriter(name, codepage, fields, QGis.WKBPolygon, None, "ESRI Shapefile")
		if writer.hasError() != QgsVectorFileWriter.NoError:
			print "Error when creating shapefile: ", writer.hasError()
			return
		del writer
		return Map(name)

	def filter(self, expression):
		if(type(expression) == str):
			return self.filterStr(expression)
		else:
			return self.filterFunc(expression)
			
	def filterStr(self, expression):
		exp = QgsExpression(expression)
		# the fields (attribute collumn descriptor) of the layer in to-commit state.
		fields = self.layer.pendingFields()
		exp.prepare(fields) # lookup inkomdatum-collumn-index
		newMap = self.makeMemoryLayer()
		newLayer = newMap.layer
		print(expression)
		for feature in self.layer.getFeatures():
			if exp.evaluate(feature):
				#newLayer.addFeature(feature) does not work
				newMap.provider.addFeatures([feature])
				#print("passed ", feature)
		newLayer.updateExtents()
		return newMap

	def filterFunc(self, func):
		newMap = self.makeMemoryLayer()
		newLayer = newMap.layer

		for feature in self.layer.getFeatures():
			if func(feature):
				#newLayer.addFeature(feature) does not work
				newMap.provider.addFeatures([feature])
				#print("passed ", feature)
		newLayer.updateExtents()
		return newMap
	
	def foreach(self, func):
		for feature in self.layer.getFeatures():
			func(feature)
		return self
	
	def remove_matching(self, other, operator, field):
		print("For now treating 'operator' argument as == in all cases")
		otherValues = {}
		attributeIdx = other.layer.fieldNameIndex(field)
		attributeRequest = QgsFeatureRequest()
		attributeRequest.setSubsetOfAttributes([attributeIdx])
		attributeRequest.setFlags( QgsFeatureRequest.NoGeometry )
		for feature in other.layer.getFeatures(attributeRequest):
			attribValue = feature.attributes()[attributeIdx]
			otherValues[attribValue] = True

		print("%d items in otherValues" % len(otherValues))
			
		newMap = self.makeMemoryLayer()
		newLayer = newMap.layer
		attributeIdx = self.layer.fieldNameIndex(field)
		count = 0
		for feature in self.layer.getFeatures():
			val = feature.attributes()[attributeIdx]
			if val not in otherValues:
				count = count + 1
				#newLayer.addFeature(feature) #does not work
				newMap.provider.addFeatures([feature])
		print("%d items in new layer" % count)
		newLayer.updateExtents()
		return newMap
	
	def save(self, name):
		if ".shp" not in name:
			name = name + "/" + name + ".shp"
		name = "new/produced/" + name
		fileops.tryMakeDir(name[: max(name.rfind("/"), name.rfind("\\"))])
		
		fields = self.provider.fields()
		writer = QgsVectorFileWriter(name, codepage, fields, QGis.WKBPolygon, None, "ESRI Shapefile")
		if writer.hasError() != QgsVectorFileWriter.NoError:
			print "Error when creating shapefile: ", writer.hasError()
			return
		for feature in self.layer.getFeatures():
			writer.addFeature(feature)
		del writer
		return Map(name)
	
	def addAreaField(self):
		fieldName = "calc_area"
		newAttributes = [ QgsField(fieldName, QVariant.Double)]
		self.provider.addAttributes(newAttributes)
		self.layer.updateFields()

		#self.layer.startEditing()
		attrId = self.layer.fieldNameIndex(fieldName)
		
		crs = QgsCoordinateReferenceSystem(3006) #sweref99 TM
		d = QgsDistanceArea()
		#d.setSourceCrs(crs)
		d.setSourceCrs(3006)
		d.setEllipsoidalMode(True)
		
		changes={}
		for feature in self.layer.getFeatures():
			id = feature.id()
			geometry = feature.geometry()
			poly = geometry.asPolygon()
			area = 0
			for ring in poly:
				area = area + d.measurePolygon(ring);
			#self.layer.changeAttributeValue(id, attrId, area)
			changes[id] = { attrId : area }
		#self.layer.commitChanges()
		self.provider.changeAttributeValues(changes)
		return self
	
	def makeJSON(self, outPath):
		with open(outPath, 'wb') as f:
			fields = self.provider.fields()
			#for field in fields:
			#	print(field.name())
			objs=[]
			for feature in self.layer.getFeatures():
				#print(feature)
				attributes = feature.attributes()
				obj = {}
				obj["polygons"] = []

				geometry = feature.geometry()
				poly = geometry.asPolygon()
				for ring in poly:
					new = []
					for pt in ring:
						new.append({"x":pt[0], "y":pt[1]})
					obj["polygons"].append(new)
				for idx in range(0, len(fields)):
					field = str(fields[idx].name());				
					attr = attributes[idx]
					#print(type(attr))
					if(type(attr) == unicode):
						#print("will derp")
						attr = attr.encode('utf-8')
					elif (type(attr) == QDate):
						attr = attr.toString("yyyy-MM-dd")
					else:
						attr = str(attr)
					#print(attr)
					obj[field] = attr
				objs.append(obj)
			asd = json.dumps(objs)
			asd = unicode(asd)
			asd = asd.replace(u"\\u201d", u"ö").replace(u"\\u201e", u"ä").replace(u"\\u2020", u"å")
			asd = asd.encode("utf-8")
			f.write(asd)
			return self
#

#filter("månad").exp("asdasd")

#data.filter("måd").save("recent")
#skydd.union("biotop").union("avtal").union("derp").save("ej_avverka")

def lookup(name):
    return name + "/" + name + ".shp"

def new(name):
	return Map("new/" + lookup(name))

def old(name):
	return Map("old/" + lookup(name))

def load(name):
	if ".shp" not in name:
		name = name + "/" + name + ".shp"
	return Map("new/produced/" + name)


