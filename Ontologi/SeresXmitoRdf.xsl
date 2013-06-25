<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:seres="http://www.seres.computas.com#"
    xmlns:fn="http://seres.no/xsd/functions"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" version="2.0">
    <xsl:strip-space elements="*"/>
    <xsl:output method="xml" indent="yes"/>
    <xsl:param name="BaseURI">http://computas.seres.begrep</xsl:param>

    <xsl:key name="xmi.id" use="@xmi.id" match="*"/>

    <xsl:template match="/">
        <xsl:element name="rdf:RDF">

                <xsl:apply-templates select="XMI/XMI.content/* "/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="*[starts-with(name(), 'seres')]">
        <xsl:param name="subjectname"/>
        <xsl:variable name="newsubjectname">
            <xsl:if test="$subjectname=''">
                <xsl:value-of select="$BaseURI"/>
                <xsl:text>#</xsl:text>
            </xsl:if>
            <xsl:value-of select="name()"/>
            <xsl:text>_</xsl:text>
            <xsl:value-of select="fn:element_uuid(key('xmi.id', @xmi.id))"/>
        </xsl:variable>
        <xsl:element name="rdf:Description">
            <xsl:attribute name="rdf:about">
                <xsl:value-of select="$newsubjectname"/>
            </xsl:attribute>
            <xsl:for-each select="@*">
                <xsl:call-template name="rdf_properties"/>
            </xsl:for-each>
        </xsl:element>
        <xsl:for-each select="*">
            <xsl:apply-templates select="* "/>
        </xsl:for-each>
    </xsl:template>

    <xsl:template name="rdf_properties">
        <xsl:variable name="local_value" select="."/>
        <xsl:element name="seres:{name()}">
            <xsl:choose>
                <xsl:when test="name() = 'xmi.id'">
                    <xsl:value-of select="."/>
                </xsl:when>
                <xsl:when test="//@xmi.id = $local_value">
                    <xsl:call-template name="rdf_resource">
                        <xsl:with-param name="id" select="."/>
                    </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="."/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:element>
    </xsl:template>
    
    <xsl:template name="rdf_resource">
        <xsl:param name="id"/>
        <xsl:attribute name="rdf:resource">
            <xsl:value-of select="$BaseURI"/>
            <xsl:text>#</xsl:text>
            <xsl:value-of select="name(key('xmi.id', $id))"/>
            <xsl:text>_</xsl:text>
            <xsl:value-of select="fn:element_uuid(key('xmi.id', $id))"/>
        </xsl:attribute>
    </xsl:template>

<!-- get uuid to element -->
    <xsl:function name="fn:element_uuid">
        <xsl:param name="element"/>
        <xsl:choose>
            <xsl:when test="fn:notNullOrEmpty($element/@xmi.uuid)">
                <xsl:value-of select="$element/@xmi.uuid"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="fn:substring-before-last-match(fn:substring-after-last-match($element/@href, '\('), '\)')"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    
    <xsl:function name="fn:notNullOrEmpty" as="xsd:boolean">
        <xsl:param name="element"/>		
        <xsl:choose>
            <xsl:when test="$element and $element != ''"><xsl:value-of select="true()"/></xsl:when>
            <xsl:otherwise><xsl:value-of select="false()"/></xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    
    <xsl:function name="fn:substring-after-last-match" as="xsd:string">
        <xsl:param name="arg" as="xsd:string?"/> 
        <xsl:param name="regex" as="xsd:string"/> 
        <xsl:sequence select=" 
            replace($arg,concat('^.*',$regex),'')
            "/>
    </xsl:function>
    
    <xsl:function name="fn:substring-before-last-match" as="xsd:string">
        <xsl:param name="arg" as="xsd:string?"/> 
        <xsl:param name="regex" as="xsd:string"/> 
        <xsl:sequence select=" 
            replace($arg,concat('^(.*)',$regex,'.*'),'$1')
            "/>
    </xsl:function>
</xsl:stylesheet>
