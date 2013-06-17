<?xml version="1.0" encoding="UTF-8" ?>
<!-- -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:seres="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	version="1.0">
	<xsl:strip-space elements="*" />
	<xsl:output method="xml" indent="yes" />
	<xsl:param name="BaseURI">http://computas.seres.begrep</xsl:param>
	<xsl:template match="/">
		<xsl:element name="rdf:RDF">
			<xsl:element name="rdf:Description">
				<xsl:attribute name="rdf:about">
					<xsl:value-of select="$BaseURI" />
				</xsl:attribute>
				<xsl:apply-templates select="XMI/XMI.content/*" />
			</xsl:element>
		</xsl:element>
	</xsl:template>


	<xsl:template match="XMI/XMI.content/*[not(name()='ODFFMM:TypeObject')]">
		<xsl:param name="subjectname" />
		<xsl:variable name="newsubjectname">
			<xsl:if test="$subjectname=''">
				<xsl:value-of select="$BaseURI" />
				<xsl:text>#</xsl:text>
			</xsl:if>
			<xsl:value-of select="name()" />
			<xsl:text>_</xsl:text>
			<xsl:value-of select="@xmi.id" />
		</xsl:variable>
		<xsl:element name="rdf:Description">
			<xsl:attribute name="rdf:about">
					<xsl:value-of select="$newsubjectname" />
				</xsl:attribute>
			<xsl:for-each select="@*">
				<xsl:variable name="local_name" select="concat('seres:', name())"></xsl:variable>
				<xsl:variable name="local_value" select="."></xsl:variable>
				<xsl:element name="{$local_name}">
					<xsl:choose>
						<xsl:when test="$local_name = 'xmi.id'">
							<xsl:value-of select="." />
						</xsl:when>
						<xsl:when test="//@xmi.id = $local_value">
							<xsl:call-template name="rdf_resource">
								<xsl:with-param name="id" select="." />
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="." />
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
			</xsl:for-each>
		</xsl:element>
	</xsl:template>


	<xsl:template name="rdf_resource">
		<xsl:param name="id" />
		<xsl:element name="rdf:resource">
			<xsl:value-of select="$BaseURI" />
			<xsl:text>#</xsl:text>
			<xsl:for-each select="//*[@xmi.id = $id]">
				<xsl:value-of select="name()"/>
			</xsl:for-each>
			<xsl:text>_</xsl:text>
			<xsl:value-of select="$id" />
		</xsl:element>
	</xsl:template>
	
</xsl:stylesheet>
