/**
 * Copyright (C) 2017 Alfresco Software Limited.
 * <p/>
 * This file is part of the Alfresco SDK project.
 * <p/>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p/>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p/>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.alfresco.vanilla.platformsample;

import org.alfresco.model.ContentModel;
import org.alfresco.rad.test.AbstractAlfrescoIT;
import org.alfresco.rad.test.AlfrescoTestRunner;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.site.SiteService;
import org.alfresco.service.cmr.version.VersionService;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * Integration Test (IT) for Hello World web script.
 *
 * @author martin.bergljung@alfresco.com
 * @version 1.0
 * @since 3.0
 */
@RunWith(AlfrescoTestRunner.class)
public class HelloWorldWebScriptIT extends AbstractAlfrescoIT {

    private static ServiceRegistry serviceRegistry;
    private static NodeService nodeService;
    private static NamespaceService namespaceService;
    private static VersionService versionService;
    private static FileFolderService fileFolderService;
    private static SiteService siteService;

    @Before
    public void setUp(){

        // We can inject since we now have the Application Context from AlfrescoTestRunner
        serviceRegistry = getServiceRegistry();
        nodeService = getServiceRegistry().getNodeService();
        namespaceService=getServiceRegistry().getNamespaceService();
        versionService =getServiceRegistry().getVersionService();
        fileFolderService= getServiceRegistry().getFileFolderService();
        siteService = getServiceRegistry().getSiteService();

    }

    @Test
    public void testWebScriptCall() throws Exception {
        String webscriptURL = "http://localhost:8080/alfresco/service/sample/helloworld";
        String expectedResponse = "Message: 'Hello from JS!' 'HelloFromJava'";

        // Login credentials for Alfresco Repo
        CredentialsProvider provider = new BasicCredentialsProvider();
        UsernamePasswordCredentials credentials = new UsernamePasswordCredentials("admin", "admin");
        provider.setCredentials(AuthScope.ANY, credentials);

        // Create HTTP Client with credentials
        CloseableHttpClient httpclient = HttpClientBuilder.create()
                .setDefaultCredentialsProvider(provider)
                .build();

        // Execute Web Script call
        try {

            // Access the SiteService
            NodeRef siteNodeRef = siteService.getSite("swsdp").getNodeRef();
            assertEquals("workspace://SpacesStore/b4cff62a-664d-4d45-9302-98723eac1319", siteNodeRef);

            HttpGet httpget = new HttpGet(webscriptURL);
            HttpResponse httpResponse = httpclient.execute(httpget);
            assertEquals("Incorrect HTTP Response Status",
                    HttpStatus.SC_OK, httpResponse.getStatusLine().getStatusCode());
            HttpEntity entity = httpResponse.getEntity();
            assertNotNull("Response from Web Script is null", entity);
            assertEquals("Incorrect Web Script Response", expectedResponse, EntityUtils.toString(entity));
        } finally {
            httpclient.close();
        }
    }
}